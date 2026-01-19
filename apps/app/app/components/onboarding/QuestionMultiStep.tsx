/**
 * QuestionMultiStep - Multi-select question with options
 */

import { useState } from "react"
import { View, Pressable, ScrollView } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { useTranslation } from "react-i18next"

import { Text, Button } from "@/components"
import type { OnboardingStep, LocalizedString } from "@/data/onboardingFlow"
import { useInterpolatedText } from "@/stores"

// =============================================================================
// TYPES
// =============================================================================

interface QuestionMultiStepProps {
  step: OnboardingStep
  onAnswer: (value: string[]) => void
  onSkip?: () => void
  skipLabel?: LocalizedString
  ctaLabel?: LocalizedString
}

// =============================================================================
// COMPONENT
// =============================================================================

export const QuestionMultiStep = ({
  step,
  onAnswer,
  onSkip,
  skipLabel,
  ctaLabel,
}: QuestionMultiStepProps) => {
  const { theme } = useUnistyles()
  const { i18n } = useTranslation()
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  const { content } = step
  const lang = i18n.language.startsWith("fr") ? "fr" : "en"
  const minSelection = content.minSelection ?? 1

  // Interpolate user name in title
  const title = useInterpolatedText(content.title?.[lang])
  const subtitle = useInterpolatedText(content.subtitle?.[lang])

  const handleOptionPress = (optionId: string) => {
    setSelectedOptions((prev) => {
      if (prev.includes(optionId)) {
        return prev.filter((id) => id !== optionId)
      }
      return [...prev, optionId]
    })
  }

  const handleContinue = () => {
    if (selectedOptions.length >= minSelection) {
      onAnswer(selectedOptions)
    }
  }

  const isValid = selectedOptions.length >= minSelection

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {onSkip && skipLabel && (
          <Pressable onPress={onSkip} style={styles.skipButton}>
            <Text size="md" color="secondary">
              {skipLabel[lang]}
            </Text>
          </Pressable>
        )}
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
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
            const isSelected = selectedOptions.includes(option.id)
            return (
              <Pressable
                key={option.id}
                style={[styles.option, isSelected && styles.optionSelected]}
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
                <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                  {isSelected && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </Pressable>
            )
          })}
        </View>
      </ScrollView>

      {/* CTA Button */}
      <View style={styles.ctaContainer}>
        <Button
          text={ctaLabel?.[lang] ?? (lang === "fr" ? "Continuer" : "Continue")}
          onPress={handleContinue}
          variant="filled"
          disabled={!isValid}
          style={[styles.ctaButton, !isValid && styles.ctaButtonDisabled]}
        />
        {!isValid && (
          <Text size="sm" color="secondary" style={styles.helperText}>
            {lang === "fr"
              ? `Sélectionnez au moins ${minSelection} option${minSelection > 1 ? "s" : ""}`
              : `Select at least ${minSelection} option${minSelection > 1 ? "s" : ""}`}
          </Text>
        )}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
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
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: theme.radius.sm,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
  },
  checkmark: {
    color: theme.colors.background,
    fontSize: 14,
    fontWeight: "bold",
  },
  ctaContainer: {
    paddingBottom: theme.spacing["2xl"],
    paddingTop: theme.spacing.md,
  },
  ctaButton: {
    width: "100%",
  },
  ctaButtonDisabled: {
    opacity: 0.5,
  },
  helperText: {
    textAlign: "center",
    marginTop: theme.spacing.sm,
  },
}))
