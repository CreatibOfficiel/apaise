/**
 * Affirmation Feed Store - Zustand state management for TikTok-like feed
 *
 * Handles:
 * - Feed affirmations list
 * - Current index tracking
 * - Swipe hint visibility
 * - Feed refresh/load more
 */

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

import { getBackgroundForIndex, type BackgroundConfig } from "../data/backgrounds"
import {
  getAllAffirmations,
  getAffirmationsByCategory,
  getFreeAffirmations,
  isFavorite,
  toggleFavorite as toggleFavoriteService,
  type Affirmation,
} from "../services/affirmationService"
import * as storage from "../utils/storage"

// =============================================================================
// TYPES
// =============================================================================

export interface FeedItem {
  affirmation: Affirmation
  background: BackgroundConfig
}

interface AffirmationFeedState {
  // State
  feedItems: FeedItem[]
  currentIndex: number
  hasSeenSwipeHint: boolean
  isLoading: boolean

  // Actions
  setCurrentIndex: (index: number) => void
  loadFeed: (categoryId?: string, isPremium?: boolean) => void
  refreshFeed: (categoryId?: string, isPremium?: boolean) => void
  toggleFavorite: (affirmationId: string) => boolean
  markSwipeHintSeen: () => void
  isFavorite: (affirmationId: string) => boolean
}

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

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Shuffle array using Fisher-Yates algorithm
 */
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Create feed items from affirmations
 */
const createFeedItems = (affirmations: Affirmation[]): FeedItem[] => {
  const shuffled = shuffleArray(affirmations)
  return shuffled.map((affirmation, index) => ({
    affirmation,
    background: getBackgroundForIndex(index),
  }))
}

// =============================================================================
// STORE
// =============================================================================

export const useAffirmationFeedStore = create<AffirmationFeedState>()(
  persist(
    (set, get) => ({
      // Initial state
      feedItems: [],
      currentIndex: 0,
      hasSeenSwipeHint: false,
      isLoading: false,

      // Actions
      setCurrentIndex: (index) => {
        set({ currentIndex: index })
      },

      loadFeed: (categoryId, isPremium = false) => {
        set({ isLoading: true })

        let affirmations: Affirmation[]

        if (categoryId) {
          affirmations = getAffirmationsByCategory(categoryId)
          if (!isPremium) {
            affirmations = affirmations.filter((a) => !a.premium)
          }
        } else if (isPremium) {
          affirmations = getAllAffirmations()
        } else {
          affirmations = getFreeAffirmations()
        }

        const feedItems = createFeedItems(affirmations)

        set({
          feedItems,
          currentIndex: 0,
          isLoading: false,
        })
      },

      refreshFeed: (categoryId, isPremium = false) => {
        // Re-shuffle and reload
        get().loadFeed(categoryId, isPremium)
      },

      toggleFavorite: (affirmationId) => {
        return toggleFavoriteService(affirmationId)
      },

      markSwipeHintSeen: () => {
        set({ hasSeenSwipeHint: true })
      },

      isFavorite: (affirmationId) => {
        return isFavorite(affirmationId)
      },
    }),
    {
      name: "affirmation-feed-storage",
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        // Only persist the swipe hint flag
        hasSeenSwipeHint: state.hasSeenSwipeHint,
      }),
    },
  ),
)

// =============================================================================
// SELECTORS
// =============================================================================

export const selectCurrentFeedItem = (state: AffirmationFeedState): FeedItem | undefined => {
  return state.feedItems[state.currentIndex]
}

export const selectFeedCount = (state: AffirmationFeedState): number => {
  return state.feedItems.length
}

export const selectHasSeenSwipeHint = (state: AffirmationFeedState): boolean => {
  return state.hasSeenSwipeHint
}
