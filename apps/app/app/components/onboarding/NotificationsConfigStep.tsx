/**
 * NotificationsConfigStep - Request notification permissions
 */

import { useState } from "react"
import { View, Pressable, Platform } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"
import * as Notifications from "expo-notifications"

import { useTranslation } from "react-i18next"

import { Text, Button } from "@/components"
import type { OnboardingStep, LocalizedString } from "@/data/onboardingFlow"

// =============================================================================
// TYPES
// =============================================================================

interface NotificationsConfigStepProps {
  step: OnboardingStep
  onContinue: () => void
  onSkip?: () => void
  skipLabel?: LocalizedString
  ctaLabel?: LocalizedString
}

// =============================================================================
// COMPONENT
// =============================================================================

export const NotificationsConfigStep = ({
  step,
  onContinue,
  onSkip,
  skipLabel,
  ctaLabel,
}: NotificationsConfigStepProps) => {
  const { theme } = useUnistyles()
  const { i18n } = useTranslation()
  const [isRequesting, setIsRequesting] = useState(false)

  const { content } = step
  const lang = i18n.language.startsWith("fr") ? "fr" : "en"

  const handleAllowNotifications = async () => {
    setIsRequesting(true)

    try {
      if (Platform.OS === "web") {
        // Web notifications
        onContinue()
        return
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync()

      if (existingStatus === "granted") {
        onContinue()
        return
      }

      const { status } = await Notifications.requestPermissionsAsync()

      // Continue regardless of result
      onContinue()
    } catch (error) {
      // Continue even if there's an error
      onContinue()
    } finally {
      setIsRequesting(false)
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
      <View style={styles.content}>
        {/* Bell icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.bellIcon}>🔔</Text>
        </View>

        {/* Title */}
        {content.title && (
          <Text size="2xl" weight="bold" style={styles.title}>
            {content.title[lang]}
          </Text>
        )}

        {/* Subtitle */}
        {content.subtitle && (
          <Text size="lg" color="secondary" style={styles.subtitle}>
            {content.subtitle[lang]}
          </Text>
        )}

        {/* Notification preview */}
        <View style={styles.previewContainer}>
          <View style={styles.previewHeader}>
            <Text style={styles.previewAppIcon}>🧘</Text>
            <Text size="sm" weight="semiBold" style={styles.previewAppName}>
              Serein
            </Text>
            <Text size="xs" color="secondary">
              {lang === "fr" ? "maintenant" : "now"}
            </Text>
          </View>
          <Text size="md" style={styles.previewBody}>
            {lang === "fr"
              ? "C'est l'heure de votre moment de sérénité 🧘"
              : "Time for your moment of serenity 🧘"}
          </Text>
        </View>
      </View>

      {/* CTA Buttons */}
      <View style={styles.ctaContainer}>
        <Button
          text={ctaLabel?.[lang] ?? (lang === "fr" ? "Autoriser les notifications" : "Allow notifications")}
          onPress={handleAllowNotifications}
          variant="filled"
          style={styles.ctaButton}
          disabled={isRequesting}
        />
        {onSkip && (
          <Pressable onPress={onSkip} style={styles.laterButton}>
            <Text size="md" color="secondary">
              {skipLabel?.[lang] ?? (lang === "fr" ? "Plus tard" : "Later")}
            </Text>
          </Pressable>
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
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.card,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing["2xl"],
    ...theme.shadows.lg,
  },
  bellIcon: {
    fontSize: 48,
  },
  title: {
    textAlign: "center",
    color: theme.colors.foreground,
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    textAlign: "center",
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing["2xl"],
  },
  previewContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    width: "100%",
    ...theme.shadows.md,
  },
  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  previewAppIcon: {
    fontSize: 20,
    marginRight: theme.spacing.sm,
  },
  previewAppName: {
    flex: 1,
    color: theme.colors.foreground,
  },
  previewBody: {
    color: theme.colors.foreground,
  },
  ctaContainer: {
    paddingBottom: theme.spacing["2xl"],
    alignItems: "center",
  },
  ctaButton: {
    width: "100%",
    marginBottom: theme.spacing.md,
  },
  laterButton: {
    padding: theme.spacing.md,
  },
}))
