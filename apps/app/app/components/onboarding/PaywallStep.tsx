/**
 * PaywallStep - Subscription paywall with timeline
 */

import { useState } from "react"
import { View, ScrollView, Pressable } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { useTranslation } from "react-i18next"

import { Text, Button } from "@/components"
import { Switch } from "@/components/Toggle/Switch"
import type { OnboardingStep, LocalizedString } from "@/data/onboardingFlow"
import { useSubscriptionStore } from "@/stores"

// =============================================================================
// TYPES
// =============================================================================

interface PaywallStepProps {
  step: OnboardingStep
  onContinue: () => void
  onSkip?: () => void
  skipLabel?: LocalizedString
  ctaLabel?: LocalizedString
}

// Timeline items
const getTimelineItems = (lang: "fr" | "en") => [
  {
    icon: "✓",
    title: lang === "fr" ? "Aujourd'hui" : "Today",
    subtitle: lang === "fr" ? "Accès complet gratuit" : "Full free access",
    status: "completed" as const,
  },
  {
    icon: "🔓",
    title: lang === "fr" ? "Jours 1-7" : "Days 1-7",
    subtitle: lang === "fr" ? "Profitez de tout Serein" : "Enjoy all of Serein",
    status: "current" as const,
  },
  {
    icon: "🔔",
    title: lang === "fr" ? "Jour 6" : "Day 6",
    subtitle: lang === "fr" ? "Rappel avant la fin de l'essai" : "Reminder before trial ends",
    status: "upcoming" as const,
  },
  {
    icon: "💳",
    title: lang === "fr" ? "Jour 8" : "Day 8",
    subtitle: lang === "fr" ? "Premier paiement si vous continuez" : "First payment if you continue",
    status: "upcoming" as const,
  },
]

// =============================================================================
// COMPONENT
// =============================================================================

export const PaywallStep = ({
  step,
  onContinue,
  onSkip,
  skipLabel,
  ctaLabel,
}: PaywallStepProps) => {
  const { theme } = useUnistyles()
  const { i18n } = useTranslation()
  const [reminderEnabled, setReminderEnabled] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<"yearly" | "monthly">("yearly")
  const [isLoading, setIsLoading] = useState(false)

  const { purchasePackage, packages } = useSubscriptionStore()

  const { content } = step
  const lang = i18n.language.startsWith("fr") ? "fr" : "en"
  const timelineItems = getTimelineItems(lang)

  const handleStartTrial = async () => {
    setIsLoading(true)

    try {
      // Find the appropriate package
      const yearlyPackage = packages.find((p) => p.identifier.includes("annual") || p.identifier.includes("yearly"))

      if (yearlyPackage) {
        const result = await purchasePackage(yearlyPackage)
        if (!result.error) {
          onContinue()
          return
        }
      }

      // Continue anyway (for testing or if no packages)
      onContinue()
    } catch (error) {
      // Continue on error
      onContinue()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.container}>
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

        {/* Timeline */}
        <View style={styles.timelineContainer}>
          <View style={styles.timelineLine} />
          {timelineItems.map((item, index) => (
            <View key={index} style={styles.timelineItem}>
              <View
                style={[
                  styles.timelineIcon,
                  item.status === "completed" && styles.timelineIconCompleted,
                  item.status === "current" && styles.timelineIconCurrent,
                ]}
              >
                <Text style={styles.timelineIconText}>{item.icon}</Text>
              </View>
              <View style={styles.timelineContent}>
                <Text size="md" weight="semiBold" style={styles.timelineTitle}>
                  {item.title}
                </Text>
                <Text size="sm" color="secondary">
                  {item.subtitle}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Reminder toggle */}
        <View style={styles.reminderContainer}>
          <Text size="md" style={styles.reminderText}>
            {lang === "fr" ? "Rappel avant la fin de l'essai" : "Reminder before trial ends"}
          </Text>
          <Switch value={reminderEnabled} onValueChange={setReminderEnabled} />
        </View>

        {/* Pricing */}
        <View style={styles.pricingContainer}>
          <View style={styles.priceRow}>
            <Text size="lg" weight="bold" style={styles.priceAmount}>
              4,17€/{lang === "fr" ? "mois" : "month"}
            </Text>
            <Text size="sm" color="secondary">
              {lang === "fr" ? "facturé annuellement à" : "billed annually at"} 49,99€/{lang === "fr" ? "an" : "year"}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* CTA Button */}
      <View style={styles.ctaContainer}>
        <Button
          text={ctaLabel?.[lang] ?? (lang === "fr" ? "Commencer l'essai gratuit" : "Start free trial")}
          onPress={handleStartTrial}
          variant="filled"
          style={styles.ctaButton}
          disabled={isLoading}
        />

        {/* Legal links */}
        <View style={styles.legalContainer}>
          <Text size="xs" color="secondary">
            {lang === "fr" ? "Conditions" : "Terms"}
          </Text>
          <Text size="xs" color="secondary">
            •
          </Text>
          <Text size="xs" color="secondary">
            {lang === "fr" ? "Restaurer" : "Restore"}
          </Text>
          <Text size="xs" color="secondary">
            •
          </Text>
          <Text size="xs" color="secondary">
            {lang === "fr" ? "Confidentialité" : "Privacy"}
          </Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: theme.spacing["2xl"],
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
  timelineContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    position: "relative",
  },
  timelineLine: {
    position: "absolute",
    left: 40,
    top: 40,
    bottom: 40,
    width: 3,
    backgroundColor: theme.colors.primary,
    opacity: 0.3,
    borderRadius: 2,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: theme.spacing.lg,
  },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
    zIndex: 1,
  },
  timelineIconCompleted: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  timelineIconCurrent: {
    borderColor: theme.colors.primary,
  },
  timelineIconText: {
    fontSize: 14,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 4,
  },
  timelineTitle: {
    color: theme.colors.foreground,
    marginBottom: 2,
  },
  reminderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  reminderText: {
    color: theme.colors.foreground,
    flex: 1,
  },
  pricingContainer: {
    alignItems: "center",
  },
  priceRow: {
    alignItems: "center",
  },
  priceAmount: {
    color: theme.colors.foreground,
    marginBottom: theme.spacing.xs,
  },
  ctaContainer: {
    paddingBottom: theme.spacing["2xl"],
  },
  ctaButton: {
    width: "100%",
    marginBottom: theme.spacing.md,
  },
  legalContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: theme.spacing.sm,
  },
}))
