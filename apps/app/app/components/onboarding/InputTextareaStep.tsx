/**
 * InputTextareaStep - Multiline text input for free-form answers
 *
 * Used for open questions like "What would you change in your life?"
 * Collects valuable user data for personalization and product improvement.
 */

import { useState } from "react"
import { View, TextInput, Pressable, KeyboardAvoidingView, Platform } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { useTranslation } from "react-i18next"

import { Text, Button } from "@/components"
import type { OnboardingStep, LocalizedString } from "@/data/onboardingFlow"

// =============================================================================
// TYPES
// =============================================================================

interface InputTextareaStepProps {
  step: OnboardingStep
  onAnswer: (value: string) => void
  onSkip?: () => void
  skipLabel?: LocalizedString
  ctaLabel?: LocalizedString
}

// =============================================================================
// COMPONENT
// =============================================================================

export const InputTextareaStep = ({
  step,
  onAnswer,
  onSkip,
  skipLabel,
  ctaLabel,
}: InputTextareaStepProps) => {
  const { theme } = useUnistyles()
  const { i18n } = useTranslation()
  const [value, setValue] = useState("")

  const { content } = step
  const lang = i18n.language.startsWith("fr") ? "fr" : "en"

  const handleSubmit = () => {
    onAnswer(value.trim())
  }

  // Allow submission even if empty (skippable by design)
  const isValid = true

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
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
      <View style={styles.content}>
        {/* Title */}
        {content.title && (
          <Text size="2xl" weight="bold" style={styles.title}>
            {content.title[lang]}
          </Text>
        )}

        {/* Subtitle */}
        {content.subtitle && (
          <Text size="md" color="secondary" style={styles.subtitle}>
            {content.subtitle[lang]}
          </Text>
        )}

        {/* Multiline Input */}
        <TextInput
          style={styles.textarea}
          value={value}
          onChangeText={setValue}
          placeholder={content.placeholder?.[lang] ?? ""}
          placeholderTextColor={theme.colors.foregroundTertiary}
          autoFocus
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          maxLength={500}
        />

        {/* Character count */}
        <Text size="xs" color="tertiary" style={styles.charCount}>
          {value.length}/500
        </Text>
      </View>

      {/* CTA Button */}
      <View style={styles.ctaContainer}>
        <Button
          text={ctaLabel?.[lang] ?? (lang === "fr" ? "Continuer" : "Continue")}
          onPress={handleSubmit}
          variant="filled"
          disabled={!isValid}
          style={styles.ctaButton}
        />
      </View>
    </KeyboardAvoidingView>
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
    paddingBottom: 60,
  },
  title: {
    textAlign: "center",
    color: theme.colors.foreground,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: theme.spacing.xl,
  },
  textarea: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    fontSize: 16,
    color: theme.colors.foreground,
    borderWidth: 2,
    borderColor: theme.colors.border,
    minHeight: 120,
    maxHeight: 200,
  },
  charCount: {
    textAlign: "right",
    marginTop: theme.spacing.sm,
  },
  ctaContainer: {
    paddingBottom: theme.spacing["2xl"],
  },
  ctaButton: {
    width: "100%",
  },
}))
