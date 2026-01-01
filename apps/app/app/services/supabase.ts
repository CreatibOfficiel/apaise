import { AppState, Platform } from "react-native"
import * as SecureStore from "expo-secure-store"
import type { SupportedStorage } from "@supabase/auth-js"
import { createClient } from "@supabase/supabase-js"
import "react-native-url-polyfill/auto"

import { env } from "../config/env"
import type { SupabaseDatabase } from "../types/supabase"
import { logger } from "../utils/Logger"
import { webSecureStorage } from "../utils/webStorageEncryption"
import { createMockSupabaseClient } from "./mocks/supabase"

const secureStoreOptions: SecureStore.SecureStoreOptions =
  Platform.OS === "ios"
    ? {
        keychainService: "shipnativeapp.supabase",
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      }
    : { keychainService: "shipnativeapp.supabase" }

// Platform-aware storage adapter for Supabase
// Uses SecureStore on mobile, webSecureStorage on web
type SupabaseAuthStorage = SupportedStorage

const PlatformStorageAdapter: SupabaseAuthStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === "web") {
      // Use encrypted storage for sensitive auth keys on web
      if (key.includes("auth") || key.includes("token") || key.includes("session")) {
        return webSecureStorage.getItem(key)
      }
      // Use regular localStorage for non-sensitive data
      return typeof localStorage !== "undefined" ? localStorage.getItem(key) : null
    }
    // Use SecureStore on mobile platforms
    try {
      return await SecureStore.getItemAsync(key, secureStoreOptions)
    } catch {
      return null
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === "web") {
      // Use encrypted storage for sensitive auth keys on web
      if (key.includes("auth") || key.includes("token") || key.includes("session")) {
        webSecureStorage.setItem(key, value)
        return
      }
      // Use regular localStorage for non-sensitive data
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(key, value)
      }
      return
    }
    // Use SecureStore on mobile platforms
    try {
      await SecureStore.setItemAsync(key, value, secureStoreOptions)
    } catch {
      // Ignore errors
    }
  },
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === "web") {
      // Remove from encrypted storage if it was stored there
      if (key.includes("auth") || key.includes("token") || key.includes("session")) {
        webSecureStorage.removeItem(key)
        return
      }
      // Remove from regular localStorage
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem(key)
      }
      return
    }
    // Use SecureStore on mobile platforms
    try {
      await SecureStore.deleteItemAsync(key, secureStoreOptions)
    } catch {
      // Ignore errors
    }
  },
}

export const supabaseUrl = env.supabaseUrl ?? ""
export const supabaseKey = env.supabasePublishableKey ?? ""

// Use mock Supabase if credentials are missing in development
const useMock = __DEV__ && (!supabaseUrl || !supabaseKey)
export const isUsingMockSupabase = useMock

type SupabaseClient = ReturnType<typeof createClient<SupabaseDatabase>>

export const supabase: SupabaseClient = useMock
  ? (createMockSupabaseClient() as unknown as SupabaseClient)
  : createClient<SupabaseDatabase>(supabaseUrl, supabaseKey, {
      auth: {
        storage: PlatformStorageAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: Platform.OS === "web", // Enable for web, disable for mobile
        flowType: "pkce", // PKCE flow for enhanced OAuth security (prevents authorization code interception)
      },
    })

if (useMock && __DEV__) {
  logger.warn("⚠️  Supabase credentials not found - using mock authentication")
  logger.info(
    "💡 Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY to apps/app/.env",
  )
}

// Only set up auto-refresh for real Supabase client
if (!useMock) {
  const realSupabase = supabase as ReturnType<typeof createClient>
  AppState.addEventListener("change", (state) => {
    if (state === "active") {
      realSupabase.auth.startAutoRefresh?.()
    } else {
      realSupabase.auth.stopAutoRefresh?.()
    }
  })
}
