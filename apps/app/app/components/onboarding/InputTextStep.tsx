/**
 * InputTextStep - Text input for name and free-form answers
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

interface InputTextStepProps {
  step: OnboardingStep
  onAnswer: (value: string) => void
  onSkip?: () => void
  skipLabel?: LocalizedString
  ctaLabel?: LocalizedString
}

// =============================================================================
// COMPONENT
// =============================================================================

export const InputTextStep = ({
  step,
  onAnswer,
  onSkip,
  skipLabel,
  ctaLabel,
}: InputTextStepProps) => {
  const { theme } = useUnistyles()
  const { i18n } = useTranslation()
  const [value, setValue] = useState("")

  const { content } = step
  const lang = i18n.language.startsWith("fr") ? "fr" : "en"

  const handleSubmit = () => {
    if (value.trim()) {
      onAnswer(value.trim())
    }
  }

  const isValid = value.trim().length > 0

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

        {/* Input */}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setValue}
          placeholder={content.placeholder?.[lang] ?? ""}
          placeholderTextColor={theme.colors.foregroundTertiary}
          autoFocus
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />
      </View>

      {/* CTA Button */}
      <View style={styles.ctaContainer}>
        <Button
          text={ctaLabel?.[lang] ?? (lang === "fr" ? "Continuer" : "Continue")}
          onPress={handleSubmit}
          variant="filled"
          disabled={!isValid}
          style={[styles.ctaButton, !isValid && styles.ctaButtonDisabled]}
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
    paddingBottom: 100,
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
  input: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    fontSize: 18,
    color: theme.colors.foreground,
    textAlign: "center",
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  ctaContainer: {
    paddingBottom: theme.spacing["2xl"],
  },
  ctaButton: {
    width: "100%",
  },
  ctaButtonDisabled: {
    opacity: 0.5,
  },
}))
