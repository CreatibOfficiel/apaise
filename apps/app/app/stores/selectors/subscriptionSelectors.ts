/**
 * Subscription Store Selectors
 *
 * Memoized selectors for derived subscription state
 */

import { useSubscriptionStore } from "../subscriptionStore"

/**
 * Check if user has pro subscription
 * Note: This is a hook but uses "select" prefix for consistency with selector pattern
 */
// eslint-disable-next-line react-hooks/rules-of-hooks
export const selectIsPro = () => useSubscriptionStore((state) => state.isPro)

/**
 * Check if user is on free tier
 * Note: This is a hook but uses "select" prefix for consistency with selector pattern
 */
// eslint-disable-next-line react-hooks/rules-of-hooks
export const selectIsFree = () => useSubscriptionStore((state) => !state.isPro)

/**
 * Get subscription status
 * Note: This is a hook but uses "select" prefix for consistency with selector pattern
 */
export const selectSubscriptionStatus = () =>
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useSubscriptionStore((state) => {
    if (state.platform === "revenuecat") {
      return state.customerInfo?.status ?? "inactive"
    }
    if (state.platform === "revenuecat-web") {
      return state.webSubscriptionInfo?.status ?? "inactive"
    }
    return "inactive"
  })

/**
 * Check if subscription is loading
 * Note: This is a hook but uses "select" prefix for consistency with selector pattern
 */
// eslint-disable-next-line react-hooks/rules-of-hooks
export const selectSubscriptionLoading = () => useSubscriptionStore((state) => state.loading)

/**
 * Get entitlements
 * Note: This is a hook but uses "select" prefix for consistency with selector pattern
 */
export const selectEntitlements = () =>
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useSubscriptionStore((state) => {
    return state.isPro ? ["pro"] : []
  })

/**
 * Check if user has specific entitlement
 * Note: This is a hook but uses "select" prefix for consistency with selector pattern
 */
export const selectHasEntitlement = (entitlementId: string) =>
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useSubscriptionStore((state) => {
    return state.isPro && entitlementId === "pro"
  })

/**
 * Get full subscription state
 * Note: This is a hook but uses "select" prefix for consistency with selector pattern
 */
export const selectSubscriptionState = () =>
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useSubscriptionStore((state) => ({
    isPro: state.isPro,
    subscriptionStatus:
      state.platform === "revenuecat"
        ? (state.customerInfo?.status ?? "inactive")
        : state.platform === "revenuecat-web"
          ? (state.webSubscriptionInfo?.status ?? "inactive")
          : "inactive",
    entitlements: state.isPro ? ["pro"] : [],
    loading: state.loading,
  }))
