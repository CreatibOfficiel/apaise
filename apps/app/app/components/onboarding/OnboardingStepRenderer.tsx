/**
 * OnboardingStepRenderer - Main component that renders the appropriate step type
 *
 * This component acts as a router, rendering the correct component based on step type.
 */

import { useCallback, useEffect } from "react"
import { View } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { useOnboardingStore, useCurrentOnboardingStep } from "@/stores"
import type { OnboardingStep } from "@/data/onboardingFlow"

import { SplashStep } from "./SplashStep"
import { QuestionSingleStep } from "./QuestionSingleStep"
import { QuestionMultiStep } from "./QuestionMultiStep"
import { InputTextStep } from "./InputTextStep"
import { InfoStep } from "./InfoStep"
import { LoadingStep } from "./LoadingStep"
import { NotificationsConfigStep } from "./NotificationsConfigStep"
import { ThemeGridStep } from "./ThemeGridStep"
import { PaywallStep } from "./PaywallStep"
import { SuccessStep } from "./SuccessStep"

// =============================================================================
// TYPES
// =============================================================================

interface OnboardingStepRendererProps {
  onComplete?: () => void
}

// =============================================================================
// COMPONENT
// =============================================================================

export const OnboardingStepRenderer = ({ onComplete }: OnboardingStepRendererProps) => {
  const currentStep = useCurrentOnboardingStep()
  const { goToNextStep, setAnswer, skipCurrentStep, isCompleted } = useOnboardingStore()

  // Handle completion
  useEffect(() => {
    if (isCompleted && onComplete) {
      onComplete()
    }
  }, [isCompleted, onComplete])

  // Handle answer submission
  const handleAnswer = useCallback(
    (value: string | string[]) => {
      if (!currentStep) return
      setAnswer(currentStep.id, value)
      goToNextStep()
    },
    [currentStep, setAnswer, goToNextStep],
  )

  // Handle skip
  const handleSkip = useCallback(() => {
    skipCurrentStep()
  }, [skipCurrentStep])

  // Handle continue (for info/loading screens)
  const handleContinue = useCallback(() => {
    goToNextStep()
  }, [goToNextStep])

  if (!currentStep) {
    return null
  }

  return (
    <View style={styles.container}>
      {renderStep(currentStep, handleAnswer, handleSkip, handleContinue)}
    </View>
  )
}

// =============================================================================
// STEP RENDERER
// =============================================================================

const renderStep = (
  step: OnboardingStep,
  onAnswer: (value: string | string[]) => void,
  onSkip: () => void,
  onContinue: () => void,
) => {
  const commonProps = {
    step,
    onSkip: step.skippable ? onSkip : undefined,
    skipLabel: step.skipLabel,
    ctaLabel: step.cta,
  }

  switch (step.type) {
    case "splash":
      return <SplashStep {...commonProps} onContinue={onContinue} />

    case "question_single":
      return <QuestionSingleStep {...commonProps} onAnswer={onAnswer} />

    case "question_multi":
      return <QuestionMultiStep {...commonProps} onAnswer={onAnswer} />

    case "input_text":
      return <InputTextStep {...commonProps} onAnswer={onAnswer} />

    case "info":
      return <InfoStep {...commonProps} onContinue={onContinue} />

    case "loading":
      return <LoadingStep {...commonProps} onComplete={onContinue} />

    case "notifications_config":
      return <NotificationsConfigStep {...commonProps} onContinue={onContinue} />

    case "theme_grid":
      return <ThemeGridStep {...commonProps} onAnswer={onAnswer} />

    case "paywall":
      return <PaywallStep {...commonProps} onContinue={onContinue} />

    case "success":
      return <SuccessStep {...commonProps} onContinue={onContinue} />

    case "redirect":
      // This should be handled at the navigation level
      return null

    default:
      return null
  }
}

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
