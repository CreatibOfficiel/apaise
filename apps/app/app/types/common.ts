/**
 * Shared primitive utility types.
 */

export type UnknownRecord = Record<string, unknown>

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue }

export type JsonObject = Record<string, JsonValue>
