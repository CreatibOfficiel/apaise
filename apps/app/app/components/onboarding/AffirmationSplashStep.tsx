/**
 * AffirmationSplashStep - Elegant animated affirmation display
 *
 * Shows a personalized affirmation with beautiful typography and animations.
 * Used as the "petit biscuit" - immediate value on first screen.
 */

import { useEffect, useRef, useState } from "react"
import { View, Animated, Easing } from "react-native"
import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { Text, Button } from "@/components"
import type { OnboardingStep, LocalizedString } from "@/data/onboardingFlow"
import { logger } from "@/utils/Logger"

// =============================================================================
// TYPES
// =============================================================================

interface AffirmationSplashStepProps {
  step: OnboardingStep
  onContinue: () => void
  ctaLabel?: LocalizedString
}

// =============================================================================
// COMPONENT
// =============================================================================

export const AffirmationSplashStep = ({
  step,
  onContinue,
  ctaLabel,
}: AffirmationSplashStepProps) => {
  const { i18n } = useTranslation()
  const [showFallbackButton, setShowFallbackButton] = useState(false)

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.95)).current
  const lineOpacity1 = useRef(new Animated.Value(0)).current
  const lineOpacity2 = useRef(new Animated.Value(0)).current

  const { content, autoAdvance } = step
  const lang = i18n.language.startsWith("fr") ? "fr" : "en"
  const affirmationText = content.affirmation?.[lang] || ""

  // Split affirmation into lines for staggered animation
  const lines = affirmationText.split("\n")

  logger.debug("[AffirmationSplashStep] Rendering", { stepId: step.id, autoAdvance })

  // Elegant staggered animation
  useEffect(() => {
    // Container fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start()

    // Scale up slightly
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start()

    // First line appears
    Animated.timing(lineOpacity1, {
      toValue: 1,
      duration: 800,
      delay: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start()

    // Second line appears
    Animated.timing(lineOpacity2, {
      toValue: 1,
      duration: 800,
      delay: 1200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start()
  }, [fadeAnim, scaleAnim, lineOpacity1, lineOpacity2])

  // Auto-advance
  useEffect(() => {
    if (autoAdvance) {
      logger.debug("[AffirmationSplashStep] Setting up auto-advance timer", { autoAdvance })
      const timer = setTimeout(() => {
        logger.debug("[AffirmationSplashStep] Auto-advance timer fired")
        onContinue()
      }, autoAdvance)

      // Fallback button after extra delay
      const fallbackTimer = setTimeout(() => {
        setShowFallbackButton(true)
      }, autoAdvance + 1500)

      return () => {
        clearTimeout(timer)
        clearTimeout(fallbackTimer)
      }
    }
    return undefined
  }, [autoAdvance, onContinue])

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
        {/* Decorative element */}
        <View style={styles.decorativeContainer}>
          <Text style={styles.decorativeQuote}>{'"'}</Text>
        </View>

        {/* Affirmation lines with staggered animation */}
        <View style={styles.affirmationContainer}>
          {lines.map((line, index) => (
            <Animated.View
              key={index}
              style={{
                opacity: index === 0 ? lineOpacity1 : lineOpacity2,
              }}
            >
              <Text style={styles.affirmationText}>{line}</Text>
            </Animated.View>
          ))}
        </View>

        {/* Decorative closing element */}
        <View style={styles.decorativeContainerBottom}>
          <Text style={styles.decorativeQuote}>{'"'}</Text>
        </View>
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
            variant="ghost"
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
    paddingHorizontal: theme.spacing.lg,
  },
  decorativeContainer: {
    marginBottom: theme.spacing.md,
  },
  decorativeContainerBottom: {
    marginTop: theme.spacing.md,
    transform: [{ rotate: "180deg" }],
  },
  decorativeQuote: {
    fontSize: 60,
    color: theme.colors.affirmationText,
    opacity: 0.3,
    fontFamily: theme.typography.fonts.serifBold,
    lineHeight: 60,
  },
  affirmationContainer: {
    alignItems: "center",
  },
  affirmationText: {
    fontSize: theme.typography.sizes.affirmation,
    color: theme.colors.affirmationText,
    textAlign: "center",
    lineHeight: theme.typography.lineHeights.affirmation,
    fontFamily: theme.typography.fonts.serifMedium,
    letterSpacing: 0.5,
    marginVertical: theme.spacing.xs,
  },
  ctaContainer: {
    width: "100%",
    paddingBottom: theme.spacing["2xl"],
  },
  ctaButton: {
    width: "100%",
  },
}))
