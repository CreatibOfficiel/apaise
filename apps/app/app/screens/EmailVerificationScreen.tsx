import { useState, useEffect, useRef } from "react"
import { View, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { AuthScreenLayout } from "@/components/layouts/AuthScreenLayout"
import { Spinner } from "@/components/Spinner"
import { Text } from "@/components/Text"
import { supabase } from "@/services/supabase"
import { useAuthStore } from "@/stores/authStore"

// =============================================================================
// COMPONENT
// =============================================================================

export const EmailVerificationScreen = () => {
  const { theme } = useUnistyles()
  const navigation = useNavigation()
  const user = useAuthStore((state) => state.user)
  const isEmailConfirmed = useAuthStore((state) => state.isEmailConfirmed)
  const resendConfirmationEmail = useAuthStore((state) => state.resendConfirmationEmail)
  const initialize = useAuthStore((state) => state.initialize)

  const [resending, setResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [resendError, setResendError] = useState("")
  const [checkingStatus, setCheckingStatus] = useState(false)
  const [countdown, setCountdown] = useState(0)

  // Track when resend was last called to pause polling briefly
  const resendTimestampRef = useRef<number>(0)
  const POLLING_PAUSE_AFTER_RESEND = 5000 // Pause polling for 5 seconds after resend

  const email = user?.email || ""

  // Redirect if no email - industry standard UX: don't show verification screen without email
  useEffect(() => {
    if (!email && user?.id) {
      // User exists but no email - redirect to register
      navigation.navigate("Register" as never)
      return
    }
    if (!user?.id) {
      // No user at all - redirect to login
      navigation.navigate("Login" as never)
      return
    }
  }, [email, user?.id, navigation])

  // Countdown timer for resend email
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [countdown])

  // Poll for email confirmation status every 3 seconds
  useEffect(() => {
    if (isEmailConfirmed) {
      // Email confirmed - reinitialize to update auth state
      initialize()
      return
    }

    // Don't start polling if we don't have a user
    if (!user?.id) {
      return
    }

    const interval = setInterval(async () => {
      // Pause polling briefly after resend to avoid conflicts
      const timeSinceResend = Date.now() - resendTimestampRef.current
      if (timeSinceResend < POLLING_PAUSE_AFTER_RESEND) {
        return
      }

      setCheckingStatus(true)
      try {
        // Store current user before polling to preserve it on error
        const currentUser = useAuthStore.getState().user

        // Refresh user data to get latest email confirmation status
        // This is important when email is confirmed from another device/browser
        try {
          const {
            data: { user: refreshedUser },
            error: getUserError,
          } = await supabase.auth.getUser()

          if (refreshedUser) {
            // Update user in store if email was confirmed
            useAuthStore.getState().setUser(refreshedUser)
          } else if (getUserError && currentUser) {
            // If getUser fails but we have a current user, preserve it
            // Don't update the store - keep existing user state
            return
          }
        } catch {
          // If getUser throws, preserve existing user and skip this poll cycle
          if (currentUser) {
            return
          }
        }

        // Only call initialize if we still have a user
        const userBeforeInitialize = useAuthStore.getState().user
        if (userBeforeInitialize) {
          await initialize()

          // After initialize, verify user still exists - if not, restore it
          const userAfterInitialize = useAuthStore.getState().user
          if (!userAfterInitialize && userBeforeInitialize) {
            // User was cleared during initialize - restore it
            useAuthStore.getState().setUser(userBeforeInitialize)
          }
        }
      } catch {
        // On any error, preserve the existing user
        const existingUser = useAuthStore.getState().user
        if (!existingUser && user) {
          // User was lost - restore it
          useAuthStore.getState().setUser(user)
        }
      } finally {
        setCheckingStatus(false)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [isEmailConfirmed, initialize, user?.id, user])

  const handleResendEmail = async () => {
    if (countdown > 0 || !email) return

    setResending(true)
    setResendError("")
    setResendSuccess(false)

    try {
      // Record timestamp to pause polling
      resendTimestampRef.current = Date.now()

      const { error } = await resendConfirmationEmail(email)

      if (error) {
        setResendError(error.message || "Failed to resend email. Please try again.")
      } else {
        setResendSuccess(true)
        // Start 60 second countdown
        setCountdown(60)
        // Clear success message after 5 seconds
        setTimeout(() => setResendSuccess(false), 5000)
      }
    } catch (err) {
      // Handle any unexpected errors
      setResendError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.")
    } finally {
      setResending(false)
    }
  }

  const handleChangeEmail = () => {
    // Navigate back to register screen
    navigation.navigate("Register" as never)
  }

  const handleBackToLogin = () => {
    // Sign out and go to login
    useAuthStore.getState().signOut()
    navigation.navigate("Login" as never)
  }

  // Don't render if no email - will redirect via useEffect
  if (!email) {
    return null
  }

  return (
    <AuthScreenLayout
      title="Verify Your Email"
      subtitle={`We've sent a confirmation email to ${email}`}
      showCloseButton={false}
      scrollable={false}
    >
      {/* Email Icon */}
      <View style={styles.iconContainer}>
        <View style={[styles.iconCircle, { backgroundColor: theme.colors.secondary }]}>
          <Ionicons name="mail-outline" size={64} color={theme.colors.primary} />
        </View>
      </View>

      {/* Instructions */}
      <View style={styles.contentContainer}>
        <Text size="lg" weight="semiBold" style={styles.instructionText}>
          Check your inbox
        </Text>
        <Text size="sm" color="secondary" style={styles.descriptionText}>
          We&apos;ve sent a confirmation link to {email}. Click the link in the email to verify your
          account.
        </Text>

        {/* Checking Status Indicator */}
        {checkingStatus && (
          <View style={styles.statusContainer}>
            <Spinner size="sm" />
            <Text size="sm" color="secondary" style={styles.statusText}>
              Checking verification status...
            </Text>
          </View>
        )}

        {/* Success Message */}
        {resendSuccess && (
          <View
            style={[styles.messageContainer, { backgroundColor: theme.colors.successBackground }]}
          >
            <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
            <Text size="sm" color="success" style={styles.messageText}>
              Confirmation email sent! Please check your inbox.
            </Text>
          </View>
        )}

        {/* Error Message */}
        {resendError && (
          <View
            style={[styles.messageContainer, { backgroundColor: theme.colors.errorBackground }]}
          >
            <Ionicons name="alert-circle" size={20} color={theme.colors.error} />
            <Text size="sm" color="error" style={styles.messageText}>
              {resendError}
            </Text>
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            countdown > 0 && styles.primaryButtonDisabled,
            {
              backgroundColor: countdown > 0 ? theme.colors.secondary : theme.colors.primary,
            },
          ]}
          onPress={handleResendEmail}
          disabled={resending || countdown > 0}
          activeOpacity={0.8}
        >
          {resending ? (
            <Spinner size="sm" color="white" />
          ) : countdown > 0 ? (
            <>
              <Ionicons
                name="time-outline"
                size={20}
                color={theme.colors.foreground}
              />
              <Text weight="semiBold" style={[styles.primaryButtonText, styles.primaryButtonTextDisabled]}>
                Resend in {countdown}s
              </Text>
            </>
          ) : (
            <>
              <Ionicons name="refresh" size={20} color={theme.colors.primaryForeground} />
              <Text weight="semiBold" style={styles.primaryButtonText}>
                Resend Email
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleChangeEmail}
          activeOpacity={0.6}
        >
          <Text color="secondary">
            Wrong email? <Text weight="semiBold">Change it</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={handleBackToLogin} activeOpacity={0.6}>
          <Text color="secondary">
            Already confirmed? <Text weight="semiBold">Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </AuthScreenLayout>
  )
}

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create((theme) => ({
  iconContainer: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.md,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  instructionText: {
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  descriptionText: {
    textAlign: "center",
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    marginTop: theme.spacing.md,
  },
  statusText: {
    marginLeft: theme.spacing.xs,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    width: "100%",
  },
  messageText: {
    flex: 1,
  },
  actionsContainer: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xs,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    ...theme.shadows.md,
  },
  primaryButtonText: {
    color: theme.colors.primaryForeground,
    fontSize: theme.typography.sizes.lg,
  },
  primaryButtonDisabled: {
    // No opacity reduction - keep button fully visible
  },
  primaryButtonTextDisabled: {
    color: theme.colors.foreground,
  },
  secondaryButton: {
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },
  linkButton: {
    alignItems: "center",
    paddingVertical: theme.spacing.xs,
  },
}))
