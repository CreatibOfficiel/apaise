/**
 * Auth Store
 *
 * Manages authentication state using Zustand with MMKV persistence.
 * Works with both real Supabase and mock Supabase (when API keys are missing).
 *
 * Type Compatibility:
 * - Uses custom Session/User types that are compatible with both mock and real Supabase
 * - The mock Supabase implements the same interface as the real one
 * - At runtime, both return the same shape of data
 */
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

import { Linking, Platform } from "react-native"
import { supabase, isUsingMockSupabase } from "../services/supabase"
import type { Session, User } from "../types/auth"
import { isEmailConfirmed } from "../types/auth"
import { logger } from "../utils/Logger"
import { authRateLimiter, passwordResetRateLimiter, signUpRateLimiter } from "../utils/rateLimiter"
import * as storage from "../utils/storage"

interface AuthState {
  session: Session | null
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  isEmailConfirmed: boolean
  hasCompletedOnboarding: boolean
  onboardingStatusByUserId: Record<string, boolean>

  // Actions
  setSession: (session: Session | null) => void
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setHasCompletedOnboarding: (completed: boolean) => Promise<void>
  signIn: (email: string, password: string) => Promise<{ error?: Error }>
  signUp: (email: string, password: string) => Promise<{ error?: Error }>
  resendConfirmationEmail: (email: string) => Promise<{ error?: Error }>
  verifyEmail: (code: string) => Promise<{ error?: Error }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error?: Error }>
  initialize: () => Promise<void>
}

const AUTH_STORAGE_KEY = "auth-storage"
export const GUEST_USER_KEY = "guest"

const getUserKey = (user?: User | null) => user?.id ?? GUEST_USER_KEY

// Track auth state change subscription to prevent duplicate listeners
let authStateSubscription: { unsubscribe: () => void } | null = null

type PersistedAuthState = Pick<AuthState, "onboardingStatusByUserId">

// Only persist non-sensitive onboarding progress; keep auth/session data in SecureStore via Supabase
const sanitizePersistedAuthState = (
  state: Partial<AuthState> | null | undefined,
): PersistedAuthState => ({
  onboardingStatusByUserId:
    typeof state === "object" &&
    state?.onboardingStatusByUserId &&
    !Array.isArray(state.onboardingStatusByUserId)
      ? {
          ...state.onboardingStatusByUserId,
          // Always consider guest onboarding complete so unauthenticated users skip onboarding
          [GUEST_USER_KEY]: state.onboardingStatusByUserId[GUEST_USER_KEY] ?? true,
        }
      : { [GUEST_USER_KEY]: true },
})

// Custom storage adapter for Zustand to use MMKV
const mmkvStorage = {
  getItem: async (name: string) => {
    const value = storage.load(name)
    return value ? JSON.stringify(value) : null
  },
  setItem: async (name: string, value: string) => {
    storage.save(name, JSON.parse(value))
  },
  removeItem: async (name: string) => {
    storage.remove(name)
  },
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      session: null,
      user: null,
      loading: true,
      isAuthenticated: false,
      isEmailConfirmed: false,
      hasCompletedOnboarding: false,
      onboardingStatusByUserId: { [GUEST_USER_KEY]: true },

      setSession: (session) => {
        const user = session?.user ?? null
        const emailConfirmed = isEmailConfirmed(user)
        set({
          session,
          user,
          isAuthenticated: !!session && emailConfirmed,
          isEmailConfirmed: emailConfirmed,
        })
      },

      setUser: (user) => {
        const emailConfirmed = isEmailConfirmed(user)
        set({
          user,
          isEmailConfirmed: emailConfirmed,
          // Only update isAuthenticated if we have a session and email is confirmed
          isAuthenticated: !!get().session && emailConfirmed,
        })
      },

      setLoading: (loading) => {
        set({ loading })
      },

      setHasCompletedOnboarding: async (completed) => {
        const { user } = get()
        const userKey = getUserKey(user)
        set((state) => ({
          hasCompletedOnboarding: completed,
          onboardingStatusByUserId: {
            ...state.onboardingStatusByUserId,
            [userKey]: completed,
          },
        }))
        if (user && !isUsingMockSupabase) {
          // Only sync to database if using real Supabase
          try {
            const { error } = await supabase
              .from("profiles")
              .upsert({ id: user.id, has_completed_onboarding: completed })

            if (error) {
              // Supabase errors are objects, not Error instances
              // Extract error details for logging
              const errorDetails = {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint,
              }
              logger.error(
                "Failed to sync onboarding status",
                { userId: user.id, error: errorDetails },
                error instanceof Error ? error : new Error(error.message || "Unknown error"),
              )
            }
          } catch (error) {
            // Handle unexpected errors (network issues, etc.)
            const errorMessage = error instanceof Error ? error.message : String(error)
            const errorDetails = error instanceof Error ? { stack: error.stack } : { error }
            logger.error(
              "Failed to sync onboarding status",
              { userId: user?.id, error: errorDetails },
              error instanceof Error ? error : new Error(errorMessage),
            )
          }
        }
      },

      signIn: async (email, password) => {
        try {
          // Rate limiting check - only count actual API calls, not button clicks
          const isAllowed = await authRateLimiter.isAllowed(`signin:${email.toLowerCase()}`)
          if (!isAllowed) {
            const resetTime = await authRateLimiter.getResetTime(`signin:${email.toLowerCase()}`)
            const minutesRemaining = Math.ceil(resetTime / (60 * 1000))
            return {
              error: new Error(
                `Too many sign-in attempts. Please try again in ${minutesRemaining} minute${minutesRemaining !== 1 ? "s" : ""}.`,
              ),
            }
          }

          // Make the actual API call - this is what we're rate limiting
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          // Note: Rate limit is incremented in isAllowed() above, which happens before the API call
          // This is intentional for security - we want to prevent excessive API calls

          if (error) {
            // Check if error is due to unconfirmed email
            const isEmailNotConfirmedError =
              error.message.toLowerCase().includes("email not confirmed") ||
              error.message.toLowerCase().includes("email_not_confirmed") ||
              error.message.toLowerCase().includes("not confirmed")
            
            if (isEmailNotConfirmedError && data?.user) {
              // User exists but email not confirmed - set user state but don't authenticate
              set({
                session: null,
                user: data.user,
                isAuthenticated: false,
                isEmailConfirmed: false,
                loading: false,
              })
              // Return error so UI can handle it (navigate to EmailVerification)
              return { error }
            }
            
            return { error }
          }

          // Reset rate limit on successful login
          await authRateLimiter.reset(`signin:${email.toLowerCase()}`)

          const emailConfirmed = isEmailConfirmed(data.user)
          set({
            session: data.session,
            user: data.user,
            isAuthenticated: !!data.session && emailConfirmed,
            isEmailConfirmed: emailConfirmed,
            loading: false,
          })

          return {}
        } catch (error) {
          return { error: error as Error }
        }
      },

      signUp: async (email, password) => {
        try {
          // Check if using real Supabase and validate configuration
          if (!isUsingMockSupabase) {
            const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || ""
            const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ""
            
            if (!supabaseUrl || !supabaseKey) {
              logger.warn("Supabase credentials missing but not using mock - this shouldn't happen")
            } else if (__DEV__) {
              // Log configuration for debugging (truncated for security)
              logger.debug("Supabase configuration check", {
                hasUrl: !!supabaseUrl,
                hasKey: !!supabaseKey,
                urlPrefix: supabaseUrl.substring(0, 30) + "...",
                keyPrefix: supabaseKey.substring(0, 10) + "...",
              })
            }
          }

          // Rate limiting check (skip in mock mode for easier development/testing)
          if (!isUsingMockSupabase) {
            const isAllowed = await signUpRateLimiter.isAllowed(`signup:${email.toLowerCase()}`)
            if (!isAllowed) {
              const resetTime = await signUpRateLimiter.getResetTime(`signup:${email.toLowerCase()}`)
              const minutesRemaining = Math.ceil(resetTime / (60 * 1000))
              return {
                error: new Error(
                  `Too many sign-up attempts. Please try again in ${minutesRemaining} minute${minutesRemaining !== 1 ? "s" : ""}.`,
                ),
              }
            }
          }

          // Generate proper redirect URL for email confirmation
          // By default, don't set emailRedirectTo - Supabase will use its built-in success page
          // This works great and requires no hosting!
          // 
          // Optional: Set EXPO_PUBLIC_EMAIL_REDIRECT_URL env var if you want custom redirect
          // For web apps, we use current origin automatically
          let emailRedirectTo: string | undefined
          
          // Check if custom redirect URL is configured
          const customRedirectUrl = process.env.EXPO_PUBLIC_EMAIL_REDIRECT_URL
          
          if (customRedirectUrl) {
            // Use custom redirect URL if provided
            emailRedirectTo = customRedirectUrl
          } else if (Platform.OS === "web") {
            // For web, use current origin if available (so it redirects back to your web app)
            try {
              if (typeof window !== "undefined" && window.location) {
                emailRedirectTo = `${window.location.origin}/auth/confirm-email`
              }
            } catch {
              // If window is not available, don't set redirect
              emailRedirectTo = undefined
            }
          }
          // For mobile: Don't set emailRedirectTo - Supabase shows its built-in success page
          // The app will detect email confirmation via polling/auth state listener

          // Build signUp parameters - pass options only if emailRedirectTo is set
          const signUpParams: Parameters<typeof supabase.auth.signUp>[0] = {
            email,
            password,
          }
          
          if (emailRedirectTo) {
            signUpParams.options = { emailRedirectTo }
          }

          let data, error
          try {
            const result = await supabase.auth.signUp(signUpParams)
            data = result.data
            error = result.error
            
            // Log for debugging - include FULL error details
            if (__DEV__) {
              if (error) {
                logger.debug("SignUp error from Supabase", { 
                  errorMessage: error.message,
                  errorStatus: (error as any).status,
                  errorName: (error as any).name,
                  fullError: JSON.stringify(error, Object.getOwnPropertyNames(error)),
                  isUsingMock: isUsingMockSupabase,
                  hasEmailRedirectTo: !!emailRedirectTo,
                  platform: Platform.OS,
                  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL?.substring(0, 30) + "...",
                })
              } else {
                logger.debug("SignUp success", { 
                  hasUser: !!data?.user, 
                  hasSession: !!data?.session, 
                  isUsingMock: isUsingMockSupabase,
                  hasEmailRedirectTo: !!emailRedirectTo,
                })
              }
            }
          } catch (signUpError) {
            // Handle network errors or other exceptions - log FULL error details
            const errorMessage = signUpError instanceof Error ? signUpError.message : String(signUpError)
            const errorStack = signUpError instanceof Error ? signUpError.stack : undefined
            const errorCause = signUpError instanceof Error ? (signUpError as any).cause : undefined
            
            logger.error("SignUp failed with exception - FULL ERROR DETAILS", { 
              errorMessage,
              errorStack,
              errorCause: errorCause ? String(errorCause) : undefined,
              errorType: signUpError?.constructor?.name,
              fullError: signUpError instanceof Error ? JSON.stringify(signUpError, Object.getOwnPropertyNames(signUpError)) : String(signUpError),
              isUsingMock: isUsingMockSupabase,
              platform: Platform.OS,
              hasEmailRedirectTo: !!emailRedirectTo,
              supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL?.substring(0, 30) + "...",
            }, signUpError as Error)
            
            // In development, return the original error so user can see real details
            if (__DEV__) {
              return { error: signUpError as Error }
            }
            
            // In production, return user-friendly error message
            if (errorMessage.includes("Network request failed") || errorMessage.includes("fetch") || errorMessage.includes("Failed to fetch")) {
              return { 
                error: new Error("Network error. Please check your internet connection and try again.") 
              }
            }
            
            return { error: signUpError as Error }
          }

          if (error) {
            // Log FULL error details from Supabase response
            const errorMessage = error.message || String(error)
            const errorStatus = (error as any).status
            const errorName = (error as any).name
            
            if (errorMessage.includes("Network request failed") || errorMessage.includes("fetch") || errorMessage.includes("Failed to fetch")) {
              logger.error("SignUp network error from Supabase response - FULL ERROR DETAILS", { 
                errorMessage,
                errorStatus,
                errorName,
                fullError: JSON.stringify(error, Object.getOwnPropertyNames(error)),
                isUsingMock: isUsingMockSupabase,
                platform: Platform.OS,
                supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL?.substring(0, 30) + "...",
              })
              
              // In development, return the original error so user can see real details
              if (__DEV__) {
                return { error }
              }
              
              // In production, return user-friendly error message
              return { 
                error: new Error("Network error. Please check your internet connection and try again.") 
              }
            }
            return { error }
          }

          // Reset rate limit on successful signup (only if rate limiting was applied)
          if (!isUsingMockSupabase) {
            await signUpRateLimiter.reset(`signup:${email.toLowerCase()}`)
          }

          // Check if email is confirmed (may be null if email confirmation is required)
          const emailConfirmed = isEmailConfirmed(data.user)
          // Only authenticate if session exists AND email is confirmed
          // If email confirmation is required, session may be null
          const shouldAuthenticate = !!data.session && emailConfirmed

          set({
            session: data.session,
            user: data.user,
            isAuthenticated: shouldAuthenticate,
            isEmailConfirmed: emailConfirmed,
            loading: false,
          })

          return {}
        } catch (error) {
          return { error: error as Error }
        }
      },

      resendConfirmationEmail: async (email: string) => {
        try {
          // Validate email
          if (!email || !email.trim()) {
            return { error: new Error("Email is required") }
          }

          const trimmedEmail = email.trim()

          // Generate proper redirect URL for email confirmation
          // Option 1: Use Supabase's default redirect (shows built-in success page) - no hosting needed
          // Option 2: Set EXPO_PUBLIC_EMAIL_REDIRECT_URL env var for custom redirect
          // Option 3: For web, use current origin
          let emailRedirectTo: string | undefined
          
          // Check if custom redirect URL is configured
          const customRedirectUrl = process.env.EXPO_PUBLIC_EMAIL_REDIRECT_URL
          
          if (customRedirectUrl) {
            // Use custom redirect URL if provided
            emailRedirectTo = customRedirectUrl
          } else if (Platform.OS === "web") {
            // For web, use current origin if available
            emailRedirectTo = typeof window !== "undefined" ? `${window.location.origin}/auth/confirm-email` : undefined
          } else {
            // For mobile, don't set redirect URL - Supabase will use its default success page
            emailRedirectTo = undefined
          }

          // Build the resend options
          const resendOptions: {
            type: "signup"
            email: string
            options?: { emailRedirectTo: string }
          } = {
            type: "signup",
            email: trimmedEmail,
          }

          // Only add emailRedirectTo if it's defined
          if (emailRedirectTo) {
            resendOptions.options = { emailRedirectTo }
          }

          // Call Supabase resend method
          // Note: This works even if the user is authenticated but email is not confirmed
          const { data, error } = await supabase.auth.resend(resendOptions)

          // Log for debugging
          if (__DEV__) {
            if (error) {
              logger.error("Failed to resend confirmation email", { 
                error: error.message || error, 
                email: trimmedEmail,
                code: (error as any)?.code,
                status: (error as any)?.status 
              })
            } else {
              logger.info("Confirmation email resent successfully", { email: trimmedEmail, data })
            }
          }

          if (error) {
            // Provide more helpful error messages
            let errorMessage = error.message || "Failed to resend email. Please try again."
            
            // Handle specific Supabase error cases
            if (error.message?.includes("rate limit") || (error as any)?.code === "rate_limit_exceeded") {
              errorMessage = "Too many requests. Please wait a moment before trying again."
            } else if (error.message?.includes("not found") || (error as any)?.code === "user_not_found") {
              errorMessage = "No account found with this email address."
            } else if (error.message?.includes("already confirmed")) {
              errorMessage = "This email has already been confirmed."
            }
            
            return { error: new Error(errorMessage) }
          }
          
          return {}
        } catch (error) {
          logger.error("Error in resendConfirmationEmail", { error, email })
          return { error: error as Error }
        }
      },

      verifyEmail: async (code: string) => {
        try {
          // Verify email with the code from the confirmation link
          const { data, error } = await supabase.auth.verifyOtp({
            token: code,
            type: "email",
          })

          if (error) {
            return { error }
          }

          // Update auth state after email verification
          const emailConfirmed = isEmailConfirmed(data.user)
          set({
            session: data.session,
            user: data.user,
            isAuthenticated: !!data.session && emailConfirmed,
            isEmailConfirmed: emailConfirmed,
            loading: false,
          })

          return {}
        } catch (error) {
          return { error: error as Error }
        }
      },

      signOut: async () => {
        await supabase.auth.signOut()
        const guestOnboarding = get().onboardingStatusByUserId[GUEST_USER_KEY] ?? false
        set({
          session: null,
          user: null,
          isAuthenticated: false,
          isEmailConfirmed: false,
          hasCompletedOnboarding: guestOnboarding,
        })
      },

      resetPassword: async (email) => {
        try {
          // Rate limiting check
          const isAllowed = await passwordResetRateLimiter.isAllowed(`reset:${email.toLowerCase()}`)
          if (!isAllowed) {
            const resetTime = await passwordResetRateLimiter.getResetTime(
              `reset:${email.toLowerCase()}`,
            )
            const minutesRemaining = Math.ceil(resetTime / (60 * 1000))
            return {
              error: new Error(
                `Too many password reset attempts. Please try again in ${minutesRemaining} minute${minutesRemaining !== 1 ? "s" : ""}.`,
              ),
            }
          }

          const { error } = await supabase.auth.resetPasswordForEmail(email)

          if (error) {
            return { error }
          }

          // Don't reset rate limit on success - allow server to handle email sending rate limits

          return {}
        } catch (error) {
          return { error: error as Error }
        }
      },

      initialize: async () => {
        try {
          set({ loading: true })

          const onboardingStatusByUserId = get().onboardingStatusByUserId

          // Get initial session
          const {
            data: { session },
          } = await supabase.auth.getSession()

          // If no session, try to get user anyway (user might exist but email not confirmed)
          let user = session?.user ?? null
          if (!user) {
            try {
              const {
                data: { user: fetchedUser },
              } = await supabase.auth.getUser()
              user = fetchedUser ?? null
            } catch {
              // If getUser fails, preserve existing user from store (might be in email verification state)
              const existingUser = get().user
              if (existingUser) {
                user = existingUser
              }
            }
          }

          const userKey = getUserKey(user)
          const localOnboardingCompleted = onboardingStatusByUserId[userKey] ?? false

          let hasCompletedOnboarding = localOnboardingCompleted
          if (user && !isUsingMockSupabase) {
            // Only query database if using real Supabase
            // Mock Supabase doesn't need this as onboarding state is handled locally
            try {
              const { data: profile, error: profileError } = await supabase
                .from("profiles")
                .select("has_completed_onboarding")
                .eq("id", user.id)
                .single()

              if (!profileError && profile?.has_completed_onboarding) {
                // Database says completed - use that
                hasCompletedOnboarding = true
              } else if (localOnboardingCompleted && user) {
                // Local says completed but database doesn't - sync to database
                try {
                  const { error: upsertError } = await supabase
                    .from("profiles")
                    .upsert({ id: user.id, has_completed_onboarding: true })

                  if (upsertError) {
                    const errorDetails = {
                      message: upsertError.message,
                      code: upsertError.code,
                      details: upsertError.details,
                      hint: upsertError.hint,
                    }
                    logger.warn("Failed to sync onboarding status to database", {
                      userId: user.id,
                      error: errorDetails,
                    })
                  } else {
                    hasCompletedOnboarding = true
                  }
                } catch (upsertError) {
                  // If upsert fails (network error, etc.), just use local state
                  const errorMessage = upsertError instanceof Error ? upsertError.message : String(upsertError)
                  logger.warn("Failed to sync onboarding status to database", {
                    userId: user.id,
                    error: { message: errorMessage },
                  })
                  hasCompletedOnboarding = localOnboardingCompleted
                }
              }
            } catch (error) {
              // Network error or database unavailable - use local state
              logger.warn("Failed to fetch profile from database, using local onboarding state", {}, error as Error)
              hasCompletedOnboarding = localOnboardingCompleted
            }
          }

          // Check email confirmation status
          const emailConfirmed = isEmailConfirmed(user)
          // Only authenticate if session exists AND email is confirmed
          const shouldAuthenticate = !!session && emailConfirmed

          set({
            session,
            user,
            isAuthenticated: shouldAuthenticate,
            isEmailConfirmed: emailConfirmed,
            hasCompletedOnboarding,
            onboardingStatusByUserId: {
              ...onboardingStatusByUserId,
              [userKey]: hasCompletedOnboarding,
            },
            loading: false,
          })

          // Listen for auth changes - only set up once
          if (!authStateSubscription) {
            const {
              data: { subscription },
            } = supabase.auth.onAuthStateChange(async (event, session) => {
              // Refresh user data to get latest email confirmation status
              // This is important when email is confirmed from another device/browser
              if (session?.user && (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED")) {
                try {
                  // Refresh user data to get latest email_confirmed_at
                  const { data: { user: refreshedUser } } = await supabase.auth.getUser()
                  if (refreshedUser) {
                    session.user = refreshedUser
                  }
                } catch (error) {
                  // If refresh fails, continue with existing user data
                  logger.warn("Failed to refresh user data", {}, error as Error)
                }
              }

              // If no session, try to get user anyway (user might exist but email not confirmed)
              let user = session?.user ?? null
              if (!user) {
                try {
                  const {
                    data: { user: fetchedUser },
                  } = await supabase.auth.getUser()
                  user = fetchedUser ?? null
                } catch {
                  // If getUser fails, preserve existing user from store (might be in email verification state)
                  const existingUser = get().user
                  if (existingUser) {
                    user = existingUser
                  }
                }
              }

              // Preserve local onboarding state - don't reset it
              const onboardingStatusByUserId = get().onboardingStatusByUserId
              const userKey = getUserKey(user)
              const currentLocalOnboarding = onboardingStatusByUserId[userKey] ?? false
              let hasCompletedOnboarding = currentLocalOnboarding

              if (user && !isUsingMockSupabase) {
                // Only query database if using real Supabase
                try {
                  const { data: profile, error: profileError } = await supabase
                    .from("profiles")
                    .select("has_completed_onboarding")
                    .eq("id", user.id)
                    .single()

                  if (!profileError && profile?.has_completed_onboarding) {
                    // Database says completed - use that
                    hasCompletedOnboarding = true
                  } else if (currentLocalOnboarding) {
                    // Local says completed but database doesn't - sync to database
                    try {
                      const { error: upsertError } = await supabase
                        .from("profiles")
                        .upsert({ id: user.id, has_completed_onboarding: true })

                      if (upsertError) {
                        const errorDetails = {
                          message: upsertError.message,
                          code: upsertError.code,
                          details: upsertError.details,
                          hint: upsertError.hint,
                        }
                        logger.warn("Failed to sync onboarding status to database", {
                          userId: user.id,
                          error: errorDetails,
                        })
                      } else {
                        hasCompletedOnboarding = true
                      }
                    } catch (upsertError) {
                      // If upsert fails (network error, etc.), just use local state
                      const errorMessage = upsertError instanceof Error ? upsertError.message : String(upsertError)
                      logger.warn("Failed to sync onboarding status to database", {
                        userId: user.id,
                        error: { message: errorMessage },
                      })
                      hasCompletedOnboarding = currentLocalOnboarding
                    }
                  }
                } catch (error) {
                  // Network error or database unavailable - use local state
                  const errorMessage = error instanceof Error ? error.message : String(error)
                  const errorDetails = error instanceof Error ? { stack: error.stack } : { error }
                  logger.warn("Failed to fetch profile from database, using local onboarding state", {
                    userId: user?.id,
                    error: errorDetails,
                  })
                  hasCompletedOnboarding = currentLocalOnboarding
                }
              }

              // Check email confirmation status
              const emailConfirmed = isEmailConfirmed(user)
              // Only authenticate if session exists AND email is confirmed
              const shouldAuthenticate = !!session && emailConfirmed

              set({
                session,
                user,
                isAuthenticated: shouldAuthenticate,
                isEmailConfirmed: emailConfirmed,
                hasCompletedOnboarding,
                onboardingStatusByUserId: {
                  ...onboardingStatusByUserId,
                  [userKey]: hasCompletedOnboarding,
                },
                loading: false,
              })
            })
            authStateSubscription = subscription
          }
        } catch (error) {
          logger.error("Auth initialization failed", {}, error as Error)
          set({ loading: false })
        }
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => mmkvStorage),
      version: 3,
      // Strip sensitive auth/session data from persisted storage
      partialize: (state) => sanitizePersistedAuthState(state) as unknown as AuthState,
      migrate: (persistedState) => {
        const sanitizedState = sanitizePersistedAuthState(persistedState as Partial<AuthState>)
        const onboardingStatusByUserId = {
          ...sanitizedState.onboardingStatusByUserId,
          [GUEST_USER_KEY]: sanitizedState.onboardingStatusByUserId[GUEST_USER_KEY] ?? true,
        }
        sanitizedState.onboardingStatusByUserId = onboardingStatusByUserId
        try {
          // Overwrite any legacy persisted tokens with the sanitized payload
          storage.save(AUTH_STORAGE_KEY, sanitizedState)
        } catch {
          // Ignore storage write errors during migration
        }
        return sanitizedState as AuthState
      },
    },
  ),
)
