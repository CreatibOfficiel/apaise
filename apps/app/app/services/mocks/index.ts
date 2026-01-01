/**
 * Mock Services Configuration
 *
 * This module provides mock implementations of external services for development
 * without API keys. Mocks are automatically enabled when API keys are missing.
 */

import { Platform } from "react-native"

import { env } from "../../config/env"
import { logger } from "../../utils/Logger"

// Check if we should use mock services
export const USE_MOCK_SERVICES =
  __DEV__ &&
  (!env.supabaseUrl ||
    !env.posthogApiKey ||
    (!env.revenueCatIosKey && !env.revenueCatAndroidKey && !env.revenueCatWebKey) ||
    !env.sentryDsn)

export const USE_MOCK_SUPABASE = __DEV__ && !env.supabaseUrl
export const USE_MOCK_POSTHOG = __DEV__ && !env.posthogApiKey

// RevenueCat mock based on platform
export const USE_MOCK_REVENUECAT =
  __DEV__ &&
  ((Platform.OS === "web" && !env.revenueCatWebKey) ||
    (Platform.OS !== "web" && !env.revenueCatIosKey && !env.revenueCatAndroidKey))

export const USE_MOCK_SENTRY = __DEV__ && !env.sentryDsn

/**
 * Log mock service status
 * Call this during app initialization (after logger is ready)
 */
export function logMockServicesStatus(): void {
  if (__DEV__) {
    logger.info("🔧 Mock Services Status", {
      Supabase: USE_MOCK_SUPABASE ? "MOCK" : "REAL",
      PostHog: USE_MOCK_POSTHOG ? "MOCK" : "REAL",
      RevenueCat: `${USE_MOCK_REVENUECAT ? "MOCK" : "REAL"} (${Platform.OS})`,
      Sentry: USE_MOCK_SENTRY ? "MOCK" : "REAL",
    })
  }
}
