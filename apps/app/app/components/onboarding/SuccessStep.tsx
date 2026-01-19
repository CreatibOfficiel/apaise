/**
 * SuccessStep - Celebration screen after successful signup
 */

import { useEffect, useRef } from "react"
import { View, Animated } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { useTranslation } from "react-i18next"

import { Text, Button } from "@/components"
import type { OnboardingStep, LocalizedString } from "@/data/onboardingFlow"
import { useInterpolatedText } from "@/stores"

// =============================================================================
// TYPES
// =============================================================================

interface SuccessStepProps {
  step: OnboardingStep
  onContinue: () => void
  ctaLabel?: LocalizedString
}

// =============================================================================
// COMPONENT
// =============================================================================

export const SuccessStep = ({ step, onContinue, ctaLabel }: SuccessStepProps) => {
  const { theme } = useUnistyles()
  const { i18n } = useTranslation()
  const scaleAnim = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(0)).current

  const { content } = step
  const lang = i18n.language.startsWith("fr") ? "fr" : "en"

  // Interpolate user name in title
  const title = useInterpolatedText(content.title?.[lang])
  const subtitle = useInterpolatedText(content.subtitle?.[lang])

  // Animate in
  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start()
  }, [scaleAnim, fadeAnim])

  return (
    <View style={styles.container}>
      {/* Content */}
      <View style={styles.content}>
        {/* Celebration icon */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.celebrationIcon}>🎉</Text>
        </Animated.View>

        {/* Title */}
        <Animated.View style={{ opacity: fadeAnim }}>
          {title && (
            <Text size="3xl" weight="bold" style={styles.title}>
              {title}
            </Text>
          )}

          {/* Subtitle */}
          {subtitle && (
            <Text size="lg" color="secondary" style={styles.subtitle}>
              {subtitle}
            </Text>
          )}
        </Animated.View>
      </View>

      {/* CTA Button */}
      <Animated.View style={[styles.ctaContainer, { opacity: fadeAnim }]}>
        <Button
          text={ctaLabel?.[lang] ?? (lang === "fr" ? "Commencer" : "Get started")}
          onPress={onContinue}
          variant="filled"
          style={styles.ctaButton}
        />
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
    paddingHorizontal: theme.spacing.xl,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.card,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing["2xl"],
    ...theme.shadows.lg,
  },
  celebrationIcon: {
    fontSize: 60,
  },
  title: {
    textAlign: "center",
    color: theme.colors.foreground,
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    textAlign: "center",
    paddingHorizontal: theme.spacing.lg,
  },
  ctaContainer: {
    paddingBottom: theme.spacing["2xl"],
  },
  ctaButton: {
    width: "100%",
  },
}))
