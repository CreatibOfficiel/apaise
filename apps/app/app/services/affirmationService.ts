/**
 * Affirmation Service
 *
 * Handles loading, filtering, and managing affirmations.
 * Provides methods to get daily affirmations, random affirmations,
 * and filter by category or premium status.
 */

import affirmationsData from "@/data/affirmations.json"
import * as storage from "@/utils/storage"

// =============================================================================
// TYPES
// =============================================================================

export interface Affirmation {
  id: string
  text_fr: string
  text_en: string
  premium: boolean
}

export interface AffirmationCategory {
  id: string
  name_fr: string
  name_en: string
  icon: string
  color: string
  affirmations: Affirmation[]
}

export interface AffirmationsData {
  version: string
  categories: AffirmationCategory[]
}

export type Language = "fr" | "en"

// Storage keys
const STORAGE_KEYS = {
  DAILY_AFFIRMATION: "daily_affirmation",
  DAILY_AFFIRMATION_DATE: "daily_affirmation_date",
  FAVORITES: "favorite_affirmations",
  VIEWED_AFFIRMATIONS: "viewed_affirmations",
}

// =============================================================================
// DATA ACCESS
// =============================================================================

/**
 * Get all affirmation categories
 */
export const getCategories = (): AffirmationCategory[] => {
  return (affirmationsData as AffirmationsData).categories
}

/**
 * Get a category by ID
 */
export const getCategoryById = (categoryId: string): AffirmationCategory | undefined => {
  return getCategories().find((cat) => cat.id === categoryId)
}

/**
 * Get all affirmations from all categories
 */
export const getAllAffirmations = (): Affirmation[] => {
  return getCategories().flatMap((cat) => cat.affirmations)
}

/**
 * Get affirmations by category
 */
export const getAffirmationsByCategory = (categoryId: string): Affirmation[] => {
  const category = getCategoryById(categoryId)
  return category?.affirmations || []
}

/**
 * Get free affirmations only
 */
export const getFreeAffirmations = (categoryId?: string): Affirmation[] => {
  const affirmations = categoryId ? getAffirmationsByCategory(categoryId) : getAllAffirmations()
  return affirmations.filter((aff) => !aff.premium)
}

/**
 * Get an affirmation by ID
 */
export const getAffirmationById = (id: string): Affirmation | undefined => {
  return getAllAffirmations().find((aff) => aff.id === id)
}

// =============================================================================
// RANDOM SELECTION
// =============================================================================

/**
 * Get a random affirmation
 */
export const getRandomAffirmation = (
  categoryId?: string,
  isPremium = false,
): Affirmation | undefined => {
  let affirmations = categoryId ? getAffirmationsByCategory(categoryId) : getAllAffirmations()

  if (!isPremium) {
    affirmations = affirmations.filter((aff) => !aff.premium)
  }

  if (affirmations.length === 0) return undefined

  const randomIndex = Math.floor(Math.random() * affirmations.length)
  return affirmations[randomIndex]
}

/**
 * Get a unique random affirmation (not recently viewed)
 */
export const getUniqueRandomAffirmation = (
  categoryId?: string,
  isPremium = false,
): Affirmation | undefined => {
  const viewedIds = getViewedAffirmations()
  let affirmations = categoryId ? getAffirmationsByCategory(categoryId) : getAllAffirmations()

  if (!isPremium) {
    affirmations = affirmations.filter((aff) => !aff.premium)
  }

  // Filter out recently viewed
  let availableAffirmations = affirmations.filter((aff) => !viewedIds.includes(aff.id))

  // If all have been viewed, reset and use all
  if (availableAffirmations.length === 0) {
    clearViewedAffirmations()
    availableAffirmations = affirmations
  }

  if (availableAffirmations.length === 0) return undefined

  const randomIndex = Math.floor(Math.random() * availableAffirmations.length)
  const selected = availableAffirmations[randomIndex]

  // Mark as viewed
  if (selected) {
    markAsViewed(selected.id)
  }

  return selected
}

// =============================================================================
// DAILY AFFIRMATION
// =============================================================================

/**
 * Get the daily affirmation
 * Returns the same affirmation for the entire day based on stored date
 */
export const getDailyAffirmation = (
  categoryId?: string,
  isPremium = false,
): Affirmation | undefined => {
  const today = new Date().toDateString()
  const storedDate = storage.load<string>(STORAGE_KEYS.DAILY_AFFIRMATION_DATE)
  const storedAffirmationId = storage.load<string>(STORAGE_KEYS.DAILY_AFFIRMATION)

  // If we have a stored affirmation for today, return it
  if (storedDate === today && storedAffirmationId) {
    const affirmation = getAffirmationById(storedAffirmationId)
    if (affirmation) {
      // Check if user still has access (premium status might have changed)
      if (!affirmation.premium || isPremium) {
        return affirmation
      }
    }
  }

  // Generate a new daily affirmation
  const newAffirmation = getUniqueRandomAffirmation(categoryId, isPremium)

  if (newAffirmation) {
    storage.save(STORAGE_KEYS.DAILY_AFFIRMATION, newAffirmation.id)
    storage.save(STORAGE_KEYS.DAILY_AFFIRMATION_DATE, today)
  }

  return newAffirmation
}

/**
 * Force refresh the daily affirmation
 */
export const refreshDailyAffirmation = (
  categoryId?: string,
  isPremium = false,
): Affirmation | undefined => {
  const today = new Date().toDateString()
  const newAffirmation = getUniqueRandomAffirmation(categoryId, isPremium)

  if (newAffirmation) {
    storage.save(STORAGE_KEYS.DAILY_AFFIRMATION, newAffirmation.id)
    storage.save(STORAGE_KEYS.DAILY_AFFIRMATION_DATE, today)
  }

  return newAffirmation
}

// =============================================================================
// FAVORITES
// =============================================================================

/**
 * Get all favorite affirmation IDs
 */
export const getFavorites = (): string[] => {
  return storage.load<string[]>(STORAGE_KEYS.FAVORITES) || []
}

/**
 * Get all favorite affirmations
 */
export const getFavoriteAffirmations = (): Affirmation[] => {
  const favoriteIds = getFavorites()
  return getAllAffirmations().filter((aff) => favoriteIds.includes(aff.id))
}

/**
 * Check if an affirmation is a favorite
 */
export const isFavorite = (affirmationId: string): boolean => {
  return getFavorites().includes(affirmationId)
}

/**
 * Toggle favorite status
 */
export const toggleFavorite = (affirmationId: string): boolean => {
  const favorites = getFavorites()
  const isCurrentlyFavorite = favorites.includes(affirmationId)

  if (isCurrentlyFavorite) {
    const newFavorites = favorites.filter((id) => id !== affirmationId)
    storage.save(STORAGE_KEYS.FAVORITES, newFavorites)
    return false
  } else {
    const newFavorites = [...favorites, affirmationId]
    storage.save(STORAGE_KEYS.FAVORITES, newFavorites)
    return true
  }
}

/**
 * Add to favorites
 */
export const addToFavorites = (affirmationId: string): void => {
  const favorites = getFavorites()
  if (!favorites.includes(affirmationId)) {
    storage.save(STORAGE_KEYS.FAVORITES, [...favorites, affirmationId])
  }
}

/**
 * Remove from favorites
 */
export const removeFromFavorites = (affirmationId: string): void => {
  const favorites = getFavorites()
  storage.save(
    STORAGE_KEYS.FAVORITES,
    favorites.filter((id) => id !== affirmationId),
  )
}

// =============================================================================
// VIEWED TRACKING
// =============================================================================

/**
 * Get viewed affirmation IDs
 */
export const getViewedAffirmations = (): string[] => {
  return storage.load<string[]>(STORAGE_KEYS.VIEWED_AFFIRMATIONS) || []
}

/**
 * Mark an affirmation as viewed
 */
export const markAsViewed = (affirmationId: string): void => {
  const viewed = getViewedAffirmations()
  if (!viewed.includes(affirmationId)) {
    // Keep only last 50 to prevent endless growth
    const newViewed = [...viewed.slice(-49), affirmationId]
    storage.save(STORAGE_KEYS.VIEWED_AFFIRMATIONS, newViewed)
  }
}

/**
 * Clear viewed affirmations history
 */
export const clearViewedAffirmations = (): void => {
  storage.remove(STORAGE_KEYS.VIEWED_AFFIRMATIONS)
}

// =============================================================================
// TEXT HELPERS
// =============================================================================

/**
 * Get affirmation text in specified language
 */
export const getAffirmationText = (affirmation: Affirmation, lang: Language): string => {
  return lang === "fr" ? affirmation.text_fr : affirmation.text_en
}

/**
 * Get category name in specified language
 */
export const getCategoryName = (category: AffirmationCategory, lang: Language): string => {
  return lang === "fr" ? category.name_fr : category.name_en
}

/**
 * Personalize affirmation text with user's name
 */
export const personalizeAffirmation = (text: string, userName?: string): string => {
  if (!userName) return text

  // Replace common placeholder patterns
  return text
    .replace(/\{\{name\}\}/g, userName)
    .replace(/\{\{nom\}\}/g, userName)
}

// =============================================================================
// STATISTICS
// =============================================================================

/**
 * Get statistics about affirmations
 */
export const getStats = () => {
  const allAffirmations = getAllAffirmations()
  const favorites = getFavorites()
  const viewed = getViewedAffirmations()

  return {
    total: allAffirmations.length,
    free: allAffirmations.filter((a) => !a.premium).length,
    premium: allAffirmations.filter((a) => a.premium).length,
    favorites: favorites.length,
    viewed: viewed.length,
    categories: getCategories().length,
  }
}
