/**
 * LoadingStep - Animated loading screens with progress
 */

import { useEffect, useRef, useState } from "react"
import { View, Animated } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { useTranslation } from "react-i18next"

import { Text, Spinner } from "@/components"
import type { OnboardingStep } from "@/data/onboardingFlow"
import { useInterpolatedText } from "@/stores"

// =============================================================================
// TYPES
// =============================================================================

interface LoadingStepProps {
  step: OnboardingStep
  onComplete: () => void
}

// =============================================================================
// COMPONENT
// =============================================================================

export const LoadingStep = ({ step, onComplete }: LoadingStepProps) => {
  const { theme } = useUnistyles()
  const { i18n } = useTranslation()
  const fadeAnim = useRef(new Animated.Value(0)).current
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  const { content, duration = 2000 } = step
  const lang = i18n.language.startsWith("fr") ? "fr" : "en"

  // Interpolate user name in title
  const title = useInterpolatedText(content.title?.[lang])
  const subtitle = useInterpolatedText(content.subtitle?.[lang])
  const steps = content.steps

  // Animate in
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [fadeAnim])

  // Progress through steps
  useEffect(() => {
    if (!steps || steps.length === 0) {
      const timer = setTimeout(onComplete, duration)
      return () => clearTimeout(timer)
    }

    const stepDuration = duration / steps.length
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(interval)
          setTimeout(onComplete, stepDuration)
          return prev
        }
        return prev + 1
      })
    }, stepDuration)

    return () => clearInterval(interval)
  }, [steps, duration, onComplete])

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Spinner */}
        <View style={styles.spinnerContainer}>
          <Spinner size="lg" />
        </View>

        {/* Title */}
        {title && (
          <Text size="2xl" weight="bold" style={styles.title}>
            {title}
          </Text>
        )}

        {/* Subtitle */}
        {subtitle && (
          <Text size="lg" color="secondary" style={styles.subtitle}>
            {subtitle}
          </Text>
        )}

        {/* Steps progress */}
        {steps && steps.length > 0 && (
          <View style={styles.stepsContainer}>
            {steps.map((stepText, index) => {
              const isCompleted = index < currentStepIndex
              const isCurrent = index === currentStepIndex
              return (
                <View key={index} style={styles.stepRow}>
                  <View
                    style={[
                      styles.stepIndicator,
                      isCompleted && styles.stepIndicatorCompleted,
                      isCurrent && styles.stepIndicatorCurrent,
                    ]}
                  >
                    {isCompleted && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text
                    size="md"
                    style={[
                      styles.stepText,
                      (isCompleted || isCurrent) && styles.stepTextActive,
                    ]}
                  >
                    {stepText[lang]}
                  </Text>
                </View>
              )
            })}
          </View>
        )}
      </Animated.View>
    </View>
  )
}

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.xl,
  },
  content: {
    alignItems: "center",
  },
  spinnerContainer: {
    marginBottom: theme.spacing["2xl"],
  },
  title: {
    textAlign: "center",
    color: theme.colors.foreground,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: theme.spacing["2xl"],
  },
  stepsContainer: {
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
  },
  stepIndicatorCompleted: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  stepIndicatorCurrent: {
    borderColor: theme.colors.primary,
  },
  checkmark: {
    color: theme.colors.background,
    fontSize: 12,
    fontWeight: "bold",
  },
  stepText: {
    color: theme.colors.foregroundTertiary,
  },
  stepTextActive: {
    color: theme.colors.foreground,
  },
}))
