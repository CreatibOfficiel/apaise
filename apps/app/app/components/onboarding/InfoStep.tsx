/**
 * InfoStep - Educational/informational screens with benefits and stats
 */

import { useRef, useEffect } from "react"
import { View, Animated } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { useTranslation } from "react-i18next"

import { Text, Button } from "@/components"
import type { OnboardingStep, LocalizedString } from "@/data/onboardingFlow"
import { useInterpolatedText } from "@/stores"

// =============================================================================
// TYPES
// =============================================================================

interface InfoStepProps {
  step: OnboardingStep
  onContinue: () => void
  onSkip?: () => void
  skipLabel?: LocalizedString
  ctaLabel?: LocalizedString
}

// =============================================================================
// COMPONENT
// =============================================================================

export const InfoStep = ({ step, onContinue, onSkip, skipLabel, ctaLabel }: InfoStepProps) => {
  const { theme } = useUnistyles()
  const { i18n } = useTranslation()
  const fadeAnim = useRef(new Animated.Value(0)).current

  const { content } = step
  const lang = i18n.language.startsWith("fr") ? "fr" : "en"

  // Interpolate user name in title
  const title = useInterpolatedText(content.title?.[lang])
  const subtitle = useInterpolatedText(content.subtitle?.[lang])

  // Animate in
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start()
  }, [fadeAnim])

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {onSkip && skipLabel && (
          <Text size="md" color="secondary" onPress={onSkip} style={styles.skipButton}>
            {skipLabel[lang]}
          </Text>
        )}
      </View>

      {/* Content */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Stat */}
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

        {/* Benefits list */}
        {content.benefits && (
          <View style={styles.benefitsContainer}>
            {content.benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitRow}>
                <Text style={styles.benefitIcon}>{benefit.icon}</Text>
                <Text size="md" style={styles.benefitText}>
                  {benefit.text[lang]}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Animated.View>

      {/* CTA Button */}
      <View style={styles.ctaContainer}>
        <Button
          text={ctaLabel?.[lang] ?? (lang === "fr" ? "Continuer" : "Continue")}
          onPress={onContinue}
          variant="filled"
          style={styles.ctaButton}
        />
      </View>
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
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: theme.spacing.md,
    minHeight: 44,
  },
  skipButton: {
    padding: theme.spacing.sm,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  title: {
    textAlign: "center",
    color: theme.colors.foreground,
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    textAlign: "center",
    paddingHorizontal: theme.spacing.md,
    lineHeight: 26,
  },
  benefitsContainer: {
    marginTop: theme.spacing["2xl"],
    gap: theme.spacing.lg,
    width: "100%",
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
  },
  benefitIcon: {
    fontSize: 28,
    marginRight: theme.spacing.md,
  },
  benefitText: {
    flex: 1,
    color: theme.colors.foreground,
  },
  ctaContainer: {
    paddingBottom: theme.spacing["2xl"],
  },
  ctaButton: {
    width: "100%",
  },
}))
