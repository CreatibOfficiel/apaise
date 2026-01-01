/**
 * Platform-agnostic error tracking types
 *
 * These types provide a unified interface for error tracking services
 * across different platforms and providers (Sentry, etc.)
 */

export type ErrorTrackingPlatform = "sentry" | "mock"

export type ErrorLevel = "fatal" | "error" | "warning" | "info" | "debug"

export type BreadcrumbType =
  | "default"
  | "debug"
  | "error"
  | "navigation"
  | "http"
  | "info"
  | "query"
  | "transaction"
  | "ui"
  | "user"

export interface UserContext {
  id?: string
  email?: string
  username?: string
  ip_address?: string
  [key: string]: unknown
}

export interface ErrorContext {
  tags?: Record<string, string>
  extra?: Record<string, unknown>
  level?: ErrorLevel
  fingerprint?: string[]
  user?: UserContext
}

export interface Breadcrumb {
  type?: BreadcrumbType
  category?: string
  message?: string
  data?: Record<string, unknown>
  level?: ErrorLevel
  timestamp?: number
}

export interface ErrorTrackingConfig {
  dsn: string
  environment?: string
  release?: string
  dist?: string
  enableInDevelopment?: boolean
  tracesSampleRate?: number
  beforeSend?: (event: Record<string, unknown>) => Record<string, unknown> | null

  // Performance monitoring (Sentry best practices)
  enableAutoPerformanceTracing?: boolean
  enableAppStartTracking?: boolean
  enableNativeFramesTracking?: boolean
  enableStallTracking?: boolean

  // Error attachments
  attachScreenshot?: boolean
  attachViewHierarchy?: boolean

  // Native configuration
  enableNative?: boolean
  enableNativeCrashHandling?: boolean
  enableNdk?: boolean
}

export interface ErrorTrackingService {
  platform: ErrorTrackingPlatform

  // Initialization
  initialize(config: ErrorTrackingConfig): void

  // Error capturing
  captureException(error: Error, context?: ErrorContext): string | undefined
  captureMessage(message: string, level?: ErrorLevel, context?: ErrorContext): string | undefined

  // User context
  setUser(user: UserContext | null): void

  // Context
  setContext(key: string, value: unknown): void
  setTag(key: string, value: string): void
  setTags(tags: Record<string, string>): void
  setExtra(key: string, value: unknown): void
  setExtras(extras: Record<string, unknown>): void

  // Breadcrumbs
  addBreadcrumb(breadcrumb: Breadcrumb): void

  // Scope management
  withScope?(callback: (scope: Record<string, unknown>) => void): void

  // Performance monitoring
  startTransaction?(name: string, op?: string): unknown

  // Utility
  close?(timeout?: number): Promise<boolean>
}

/**
 * Helper to create error context
 */
export function createErrorContext(
  tags?: Record<string, string>,
  extra?: Record<string, unknown>,
  level?: ErrorLevel,
): ErrorContext {
  return {
    tags,
    extra,
    level,
  }
}

/**
 * Helper to create breadcrumb
 */
export function createBreadcrumb(
  message: string,
  category?: string,
  type?: BreadcrumbType,
  data?: Record<string, unknown>,
): Breadcrumb {
  return {
    message,
    category,
    type: type || "default",
    data,
    timestamp: Date.now() / 1000,
  }
}

/**
 * Standard error tags
 */
export const ErrorTags = {
  COMPONENT: "component",
  SCREEN: "screen",
  ACTION: "action",
  PLATFORM: "platform",
  ENVIRONMENT: "environment",
} as const

/**
 * Standard breadcrumb categories
 */
export const BreadcrumbCategories = {
  AUTH: "auth",
  NAVIGATION: "navigation",
  API: "api",
  UI: "ui",
  SUBSCRIPTION: "subscription",
  USER_ACTION: "user.action",
} as const
