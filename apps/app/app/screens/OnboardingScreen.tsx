/**
 * OnboardingScreen - Affirmations app onboarding (I AM style)
 *
 * Features:
 * - Progressive questions (domain → emotions → obstacles → goals)
 * - "Petit sucre" rewards throughout
 * - No auth required - starts immediately
 * - Paywall with free trial timeline
 */

import { FC, useCallback, useEffect } from "react"
import { View, Pressable, BackHandler } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { LinearGradient } from "expo-linear-gradient"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { OnboardingStepRenderer } from "@/components/onboarding"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import {
  useOnboardingStore,
  selectProgress,
  selectCanGoBack,
  selectCurrentStep,
} from "@/stores"
import { logger } from "@/utils/Logger"

// =============================================================================
// TYPES
// =============================================================================

interface OnboardingScreenProps extends AppStackScreenProps<"Onboarding"> {}

// =============================================================================
// COMPONENT
// =============================================================================

export const OnboardingScreen: FC<OnboardingScreenProps> = function OnboardingScreen(_props) {
  const { theme } = useUnistyles()
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<AppStackScreenProps<"Onboarding">["navigation"]>()

  // Onboarding store
  const progress = useOnboardingStore(selectProgress)
  const canGoBack = useOnboardingStore(selectCanGoBack)
  const currentStep = useOnboardingStore(selectCurrentStep)
  const goToPreviousStep = useOnboardingStore((state) => state.goToPreviousStep)
  const completeOnboarding = useOnboardingStore((state) => state.completeOnboarding)
  const isCompleted = useOnboardingStore((state) => state.isCompleted)

  // Determine if we should show the header (not on splash/loading/affirmation screens)
  const showHeader =
    currentStep?.type !== "splash" &&
    currentStep?.type !== "affirmation_splash" &&
    currentStep?.type !== "loading" &&
    currentStep?.type !== "success"

  // Handle back button (Android)
  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (canGoBack) {
        goToPreviousStep()
        return true
      }
      return false
    })

    return () => backHandler.remove()
  }, [canGoBack, goToPreviousStep])

  // Handle onboarding completion
  const handleComplete = useCallback(() => {
    logger.info("[Onboarding] Completed - navigating to Main")

    // Mark onboarding as complete (persisted in MMKV)
    completeOnboarding()

    // Navigate to main app
    navigation.replace("Main", { screen: "Home" })
  }, [completeOnboarding, navigation])

  // Auto-complete when store says we're done
  useEffect(() => {
    if (isCompleted) {
      handleComplete()
    }
  }, [isCompleted, handleComplete])

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.gradientStart, theme.colors.gradientMiddle, theme.colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Header with back button and progress */}
        {showHeader && (
          <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
            {/* Back button */}
            <View style={styles.headerLeft}>
              {canGoBack && (
                <Pressable onPress={goToPreviousStep} style={styles.backButton} hitSlop={20}>
                  <Ionicons name="chevron-back" size={28} color={theme.colors.foreground} />
                </Pressable>
              )}
            </View>

            {/* Progress bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBackground}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
            </View>

            {/* Spacer for balance */}
            <View style={styles.headerRight} />
          </View>
        )}

        {/* Step content */}
        <View style={[styles.content, !showHeader && { paddingTop: insets.top }]}>
          <OnboardingStepRenderer onComplete={handleComplete} />
        </View>
      </LinearGradient>
    </View>
  )
}

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  headerLeft: {
    width: 44,
    alignItems: "flex-start",
  },
  headerRight: {
    width: 44,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  progressContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  progressBackground: {
    height: 4,
    backgroundColor: theme.colors.foregroundTertiary,
    borderRadius: 2,
    opacity: 0.3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  content: {
    flex: 1,
  },
}))
