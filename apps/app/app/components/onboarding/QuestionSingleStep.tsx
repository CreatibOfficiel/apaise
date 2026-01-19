/**
 * QuestionSingleStep - Single-select question with options
 */

import { useState } from "react"
import { View, Pressable } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { useTranslation } from "react-i18next"

import { Text, Button } from "@/components"
import type { OnboardingStep, LocalizedString } from "@/data/onboardingFlow"
import { useInterpolatedText } from "@/stores"

// =============================================================================
// TYPES
// =============================================================================

interface QuestionSingleStepProps {
  step: OnboardingStep
  onAnswer: (value: string) => void
  onSkip?: () => void
  skipLabel?: LocalizedString
}

// =============================================================================
// COMPONENT
// =============================================================================

export const QuestionSingleStep = ({
  step,
  onAnswer,
  onSkip,
  skipLabel,
}: QuestionSingleStepProps) => {
  const { theme } = useUnistyles()
  const { i18n } = useTranslation()
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const { content } = step
  const lang = i18n.language.startsWith("fr") ? "fr" : "en"

  // Interpolate user name in title
  const title = useInterpolatedText(content.title?.[lang])
  const subtitle = useInterpolatedText(content.subtitle?.[lang])

  const handleOptionPress = (optionId: string) => {
    setSelectedOption(optionId)
    // Auto-advance on selection for single-select
    setTimeout(() => onAnswer(optionId), 200)
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Skip button */}
        {onSkip && skipLabel && (
          <Pressable onPress={onSkip} style={styles.skipButton}>
            <Text size="md" color="secondary">
              {skipLabel[lang]}
            </Text>
          </Pressable>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title */}
        {title && (
          <Text size="2xl" weight="bold" style={styles.title}>
            {title}
          </Text>
        )}

        {/* Subtitle */}
        {subtitle && (
          <Text size="md" color="secondary" style={styles.subtitle}>
            {subtitle}
          </Text>
        )}

        {/* Options */}
        <View style={styles.optionsContainer}>
          {content.options?.map((option) => {
            const isSelected = selectedOption === option.id
            return (
              <Pressable
                key={option.id}
                style={[
                  styles.option,
                  isSelected && styles.optionSelected,
                  option.recommended && styles.optionRecommended,
                ]}
                onPress={() => handleOptionPress(option.id)}
              >
                {option.icon && <Text style={styles.optionIcon}>{option.icon}</Text>}
                <Text
                  size="lg"
                  weight={isSelected ? "semiBold" : "medium"}
                  style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}
                >
                  {option.label[lang]}
                </Text>
                {option.recommended && (
                  <View style={styles.recommendedBadge}>
                    <Text size="xs" weight="semiBold" style={styles.recommendedText}>
                      {lang === "fr" ? "Recommandé" : "Recommended"}
                    </Text>
                  </View>
                )}
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </Pressable>
            )
          })}
        </View>
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
    paddingTop: theme.spacing.xl,
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
  optionsContainer: {
    gap: theme.spacing.md,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 2,
    borderColor: "transparent",
  },
  optionSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: `${theme.colors.primary}15`,
  },
  optionRecommended: {
    borderColor: `${theme.colors.primary}50`,
  },
  optionIcon: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  optionLabel: {
    flex: 1,
    color: theme.colors.foreground,
  },
  optionLabelSelected: {
    color: theme.colors.primary,
  },
  recommendedBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.full,
    marginRight: theme.spacing.sm,
  },
  recommendedText: {
    color: theme.colors.background,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: theme.colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
  },
}))
