/**
 * Onboarding Store - Zustand state management for onboarding flow
 *
 * Handles:
 * - Current step tracking
 * - User answers storage
 * - Navigation (next/back)
 * - Progress calculation
 * - Persistence across app restarts
 */

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

import {
  ONBOARDING_STEPS,
  getStepById,
  getNextStepId,
  getStepIndex,
  type OnboardingAnswers,
  type OnboardingStep,
} from "../data/onboardingFlow"
import * as storage from "../utils/storage"

// =============================================================================
// TYPES
// =============================================================================

interface OnboardingState {
  // State
  currentStepId: string
  answers: OnboardingAnswers
  isCompleted: boolean
  startedAt: number | null
  completedAt: number | null

  // Computed (via getters)
  currentStep: OnboardingStep | undefined
  progress: number
  stepHistory: string[]

  // Actions
  setAnswer: (questionId: string, value: string | string[]) => void
  goToNextStep: () => void
  goToPreviousStep: () => void
  goToStep: (stepId: string) => void
  skipCurrentStep: () => void
  completeOnboarding: () => void
  resetOnboarding: () => void

  // Getters
  getAnswer: (questionId: string) => string | string[] | undefined
  getUserName: () => string
  canGoBack: () => boolean
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
// STORE
// =============================================================================

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentStepId: ONBOARDING_STEPS[0]?.id ?? "affirmation_welcome",
      answers: {},
      isCompleted: false,
      startedAt: null,
      completedAt: null,
      stepHistory: [],

      // Computed values (accessed via get())
      get currentStep() {
        return getStepById(get().currentStepId)
      },

      get progress() {
        const currentIndex = getStepIndex(get().currentStepId)
        return Math.round((currentIndex / ONBOARDING_STEPS.length) * 100)
      },

      // Actions
      setAnswer: (questionId, value) => {
        set((state) => ({
          answers: {
            ...state.answers,
            [questionId]: value,
          },
          // Start timer on first answer
          startedAt: state.startedAt ?? Date.now(),
        }))
      },

      goToNextStep: () => {
        const { currentStepId, answers, stepHistory } = get()
        const nextStepId = getNextStepId(currentStepId, answers)

        // Check if we're at the end
        if (nextStepId === "app_home" || nextStepId === "HomeScreen") {
          get().completeOnboarding()
          return
        }

        set({
          currentStepId: nextStepId,
          stepHistory: [...stepHistory, currentStepId],
        })
      },

      goToPreviousStep: () => {
        const { stepHistory } = get()

        if (stepHistory.length === 0) return

        const previousStepId = stepHistory[stepHistory.length - 1]
        const newHistory = stepHistory.slice(0, -1)

        set({
          currentStepId: previousStepId,
          stepHistory: newHistory,
        })
      },

      goToStep: (stepId) => {
        const step = getStepById(stepId)
        if (!step) return

        const { currentStepId, stepHistory } = get()

        set({
          currentStepId: stepId,
          stepHistory: [...stepHistory, currentStepId],
        })
      },

      skipCurrentStep: () => {
        // Same as goToNextStep but doesn't require an answer
        get().goToNextStep()
      },

      completeOnboarding: () => {
        set({
          isCompleted: true,
          completedAt: Date.now(),
        })
      },

      resetOnboarding: () => {
        set({
          currentStepId: ONBOARDING_STEPS[0]?.id ?? "affirmation_welcome",
          answers: {},
          isCompleted: false,
          startedAt: null,
          completedAt: null,
          stepHistory: [],
        })
      },

      // Getters
      getAnswer: (questionId) => {
        return get().answers[questionId]
      },

      getUserName: () => {
        const name = get().answers.name_input as string | undefined
        return name || ""
      },

      canGoBack: () => {
        const { stepHistory, currentStepId } = get()
        const currentStep = getStepById(currentStepId)

        // Can't go back from splash screens or if no history
        if (stepHistory.length === 0) return false
        if (currentStep?.type === "splash") return false
        if (currentStep?.type === "affirmation_splash") return false
        if (currentStep?.type === "paywall") return false

        return true
      },
    }),
    {
      name: "onboarding-storage",
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        // Persist everything except computed values
        currentStepId: state.currentStepId,
        answers: state.answers,
        isCompleted: state.isCompleted,
        startedAt: state.startedAt,
        completedAt: state.completedAt,
        stepHistory: state.stepHistory,
      }),
    },
  ),
)

// =============================================================================
// SELECTORS (for optimized re-renders)
// =============================================================================

export const selectCurrentStep = (state: OnboardingState) => getStepById(state.currentStepId)

export const selectProgress = (state: OnboardingState) => {
  const currentIndex = getStepIndex(state.currentStepId)
  return Math.round((currentIndex / ONBOARDING_STEPS.length) * 100)
}

export const selectIsCompleted = (state: OnboardingState) => state.isCompleted

export const selectUserName = (state: OnboardingState) => {
  const name = state.answers.name_input as string | undefined
  return name || ""
}

export const selectCanGoBack = (state: OnboardingState) => {
  const currentStep = getStepById(state.currentStepId)
  if (state.stepHistory.length === 0) return false
  if (currentStep?.type === "splash") return false
  if (currentStep?.type === "affirmation_splash") return false
  if (currentStep?.type === "paywall") return false
  return true
}

export const selectUserDomain = (state: OnboardingState) => {
  return (state.answers.transform_domain as string) || "confidence"
}

export const selectNotificationTime = (state: OnboardingState) => {
  return (state.answers.notification_time as string) || "morning"
}

// =============================================================================
// HOOKS
// =============================================================================

/**
 * Hook to get the current step with all computed values
 */
export const useCurrentOnboardingStep = () => {
  const currentStepId = useOnboardingStore((state) => state.currentStepId)
  const answers = useOnboardingStore((state) => state.answers)

  const step = getStepById(currentStepId)

  if (!step) return null

  // If the step has dynamic content, compute it
  if (step.content.dynamicContent) {
    const dynamicValues = step.content.dynamicContent(answers)
    return {
      ...step,
      content: {
        ...step.content,
        title: dynamicValues.title,
        subtitle: dynamicValues.subtitle,
      },
    }
  }

  return step
}

/**
 * Hook to interpolate user name in text
 */
export const useInterpolatedText = (text: string | undefined): string => {
  const userName = useOnboardingStore(selectUserName)

  if (!text) return ""

  return text.replace(/\{\{name\}\}/g, userName || "")
}
