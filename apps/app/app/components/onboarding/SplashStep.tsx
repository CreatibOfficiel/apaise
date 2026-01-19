/**
 * SplashStep - Animated splash screens with social proof
 */

import { useEffect, useRef, useState } from "react"
import { View, Animated } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { useTranslation } from "react-i18next"

import { Text, Button } from "@/components"
import type { OnboardingStep, LocalizedString } from "@/data/onboardingFlow"
import { logger } from "@/utils/Logger"

// =============================================================================
// TYPES
// =============================================================================

interface SplashStepProps {
  step: OnboardingStep
  onContinue: () => void
  ctaLabel?: LocalizedString
}

// =============================================================================
// COMPONENT
// =============================================================================

export const SplashStep = ({ step, onContinue, ctaLabel }: SplashStepProps) => {
  const { theme } = useUnistyles()
  const { i18n } = useTranslation()
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.9)).current
  const [showFallbackButton, setShowFallbackButton] = useState(false)

  const { content, autoAdvance } = step
  const lang = i18n.language.startsWith("fr") ? "fr" : "en"

  logger.debug("[SplashStep] Rendering", { stepId: step.id, autoAdvance, hasCtaLabel: !!ctaLabel })

  // Animate in
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start()
  }, [fadeAnim, scaleAnim])

  // Auto-advance
  useEffect(() => {
    if (autoAdvance) {
      logger.debug("[SplashStep] Setting up auto-advance timer", { autoAdvance, stepId: step.id })
      const timer = setTimeout(() => {
        logger.debug("[SplashStep] Auto-advance timer fired", { stepId: step.id })
        onContinue()
      }, autoAdvance)

      // Fallback button after extra delay
      const fallbackTimer = setTimeout(() => {
        logger.debug("[SplashStep] Showing fallback button", { stepId: step.id })
        setShowFallbackButton(true)
      }, autoAdvance + 1000)

      return () => {
        clearTimeout(timer)
        clearTimeout(fallbackTimer)
      }
    }
    return undefined
  }, [autoAdvance, onContinue, step.id])

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Stat display */}
        {content.stat && (
          <View style={styles.statContainer}>
            <Text size="4xl" weight="bold" style={styles.statNumber}>
              {content.stat.number}
            </Text>
            <Text size="lg" color="secondary" style={styles.statText}>
              {content.stat.text[lang]}
            </Text>
          </View>
        )}

        {/* Rating stars */}
        {content.rating && (
          <View style={styles.ratingContainer}>
            {Array.from({ length: content.rating }).map((_, i) => (
              <Text key={i} style={styles.star}>
                ⭐
              </Text>
            ))}
          </View>
        )}

        {/* Review text */}
        {content.review && (
          <Text size="xl" style={styles.reviewText}>
            "{content.review[lang]}"
          </Text>
        )}

        {/* Title */}
        {content.title && (
          <Text size="3xl" weight="bold" style={styles.title}>
            {content.title[lang]}
          </Text>
        )}

        {/* Subtitle */}
        {content.subtitle && (
          <Text size="lg" color="secondary" style={styles.subtitle}>
            {content.subtitle[lang]}
          </Text>
        )}
      </Animated.View>

      {/* CTA Button (only if no auto-advance) */}
      {!autoAdvance && ctaLabel && (
        <View style={styles.ctaContainer}>
          <Button
            text={ctaLabel[lang]}
            onPress={onContinue}
            variant="filled"
            style={styles.ctaButton}
          />
        </View>
      )}

      {/* Fallback button if auto-advance didn't work */}
      {showFallbackButton && (
        <View style={styles.ctaContainer}>
          <Button
            text={lang === "fr" ? "Continuer" : "Continue"}
            onPress={onContinue}
            variant="filled"
            style={styles.ctaButton}
          />
        </View>
      )}
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
    justifyContent: "center",
    flex: 1,
  },
  statContainer: {
    alignItems: "center",
    marginBottom: theme.spacing["2xl"],
  },
  statNumber: {
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  statText: {
    textAlign: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: theme.spacing.lg,
  },
  star: {
    fontSize: 24,
    marginHorizontal: 2,
  },
  reviewText: {
    textAlign: "center",
    fontStyle: "italic",
    color: theme.colors.foreground,
    paddingHorizontal: theme.spacing.lg,
    lineHeight: 28,
  },
  title: {
    textAlign: "center",
    color: theme.colors.foreground,
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    textAlign: "center",
    paddingHorizontal: theme.spacing.md,
  },
  ctaContainer: {
    width: "100%",
    paddingBottom: theme.spacing["2xl"],
  },
  ctaButton: {
    width: "100%",
  },
}))
