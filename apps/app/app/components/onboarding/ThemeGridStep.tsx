/**
 * ThemeGridStep - Visual theme selection grid
 */

import { useState } from "react"
import { View, Pressable, Image, ScrollView } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { useTranslation } from "react-i18next"

import { Text, Button } from "@/components"
import type { OnboardingStep, LocalizedString } from "@/data/onboardingFlow"

// =============================================================================
// TYPES
// =============================================================================

interface ThemeGridStepProps {
  step: OnboardingStep
  onAnswer: (value: string) => void
  onSkip?: () => void
  skipLabel?: LocalizedString
  ctaLabel?: LocalizedString
}

// Theme options
const THEMES = [
  { id: "minimal", name: { fr: "Minimaliste", en: "Minimalist" }, color: "#F5F5F5" },
  { id: "nature", name: { fr: "Nature", en: "Nature" }, color: "#4CAF50" },
  { id: "night", name: { fr: "Nuit étoilée", en: "Starry night" }, color: "#1A237E" },
  { id: "ocean", name: { fr: "Océan", en: "Ocean" }, color: "#0288D1" },
  { id: "forest", name: { fr: "Forêt", en: "Forest" }, color: "#2E7D32" },
  { id: "sunset", name: { fr: "Coucher de soleil", en: "Sunset" }, color: "#FF7043" },
]

// =============================================================================
// COMPONENT
// =============================================================================

export const ThemeGridStep = ({
  step,
  onAnswer,
  onSkip,
  skipLabel,
  ctaLabel,
}: ThemeGridStepProps) => {
  const { theme } = useUnistyles()
  const { i18n } = useTranslation()
  const [selectedTheme, setSelectedTheme] = useState<string | null>("minimal")

  const { content } = step
  const lang = i18n.language.startsWith("fr") ? "fr" : "en"

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId)
  }

  const handleContinue = () => {
    if (selectedTheme) {
      onAnswer(selectedTheme)
    }
  }

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

        {/* Theme grid */}
        <View style={styles.grid}>
          {THEMES.map((t) => {
            const isSelected = selectedTheme === t.id
            return (
              <Pressable
                key={t.id}
                style={[styles.themeCard, isSelected && styles.themeCardSelected]}
                onPress={() => handleThemeSelect(t.id)}
              >
                <View style={[styles.themePreview, { backgroundColor: t.color }]}>
                  <Text style={styles.themeIcon}>🧘</Text>
                </View>
                <Text size="sm" weight={isSelected ? "semiBold" : "medium"} style={styles.themeName}>
                  {t.name[lang]}
                </Text>
                {isSelected && (
                  <View style={styles.selectedBadge}>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                )}
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
          style={styles.ctaButton}
          disabled={!selectedTheme}
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  themeCard: {
    width: "47%",
    aspectRatio: 0.8,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "transparent",
  },
  themeCardSelected: {
    borderColor: theme.colors.primary,
  },
  themePreview: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  themeIcon: {
    fontSize: 40,
    opacity: 0.9,
  },
  themeName: {
    textAlign: "center",
    paddingVertical: theme.spacing.sm,
    color: theme.colors.foreground,
  },
  selectedBadge: {
    position: "absolute",
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: {
    color: theme.colors.background,
    fontSize: 14,
    fontWeight: "bold",
  },
  ctaContainer: {
    paddingBottom: theme.spacing["2xl"],
  },
  ctaButton: {
    width: "100%",
  },
}))
