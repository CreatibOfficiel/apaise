/**
 * AffirmationCard - Main card component for displaying affirmations
 *
 * Features:
 * - Elegant typography with serif font
 * - Favorite button with animation
 * - Share functionality
 * - Subtle animations on interactions
 */

import { FC, useState, useCallback, useRef, useEffect } from "react"
import { View, Pressable, Animated, Share, Platform } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { StyleSheet, useUnistyles } from "react-native-unistyles"
import { useTranslation } from "react-i18next"

import { Text } from "@/components/Text"
import type { Affirmation } from "@/services/affirmationService"
import { getAffirmationText, isFavorite, toggleFavorite } from "@/services/affirmationService"
import { haptics } from "@/utils/haptics"

// =============================================================================
// TYPES
// =============================================================================

interface AffirmationCardProps {
  affirmation: Affirmation
  onRefresh?: () => void
  onFavoriteChange?: (isFavorite: boolean) => void
  showRefreshButton?: boolean
  userName?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

export const AffirmationCard: FC<AffirmationCardProps> = ({
  affirmation,
  onRefresh,
  onFavoriteChange,
  showRefreshButton = true,
  userName,
}) => {
  const { theme } = useUnistyles()
  const { i18n, t } = useTranslation()
  const lang = i18n.language.startsWith("fr") ? "fr" : "en"

  const [favorite, setFavorite] = useState(() => isFavorite(affirmation.id))

  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current
  const heartScale = useRef(new Animated.Value(1)).current
  const textOpacity = useRef(new Animated.Value(0)).current

  // Animate text on mount and affirmation change
  useEffect(() => {
    textOpacity.setValue(0)
    Animated.timing(textOpacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start()

    // Update favorite status when affirmation changes
    setFavorite(isFavorite(affirmation.id))
  }, [affirmation.id, textOpacity])

  // Get personalized text
  const affirmationText = getAffirmationText(affirmation, lang as "fr" | "en")
  const displayText = userName
    ? affirmationText.replace(/\{\{name\}\}/g, userName)
    : affirmationText

  // Handle favorite toggle
  const handleFavoritePress = useCallback(() => {
    haptics.buttonPress()

    // Animate heart
    Animated.sequence([
      Animated.timing(heartScale, {
        toValue: 1.3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(heartScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()

    const newFavoriteStatus = toggleFavorite(affirmation.id)
    setFavorite(newFavoriteStatus)
    onFavoriteChange?.(newFavoriteStatus)
  }, [affirmation.id, heartScale, onFavoriteChange])

  // Handle refresh
  const handleRefresh = useCallback(() => {
    haptics.buttonPress()

    // Animate scale down and up
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start()

    onRefresh?.()
  }, [onRefresh, scaleAnim])

  // Handle share
  const handleShare = useCallback(async () => {
    haptics.buttonPress()

    const shareMessage =
      lang === "fr"
        ? `"${displayText}"\n\n- Serein App`
        : `"${displayText}"\n\n- Serein App`

    try {
      await Share.share({
        message: shareMessage,
        ...(Platform.OS === "ios" && { title: "Affirmation" }),
      })
    } catch (error) {
      // User cancelled or error occurred
    }
  }, [displayText, lang])

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {/* Decorative quote mark */}
      <View style={styles.quoteContainer}>
        <Text style={styles.quoteMark}>"</Text>
      </View>

      {/* Affirmation text */}
      <Animated.View style={{ opacity: textOpacity }}>
        <Text style={styles.affirmationText}>{displayText}</Text>
      </Animated.View>

      {/* Closing quote mark */}
      <View style={styles.quoteContainerBottom}>
        <Text style={styles.quoteMark}>"</Text>
      </View>

      {/* Action buttons */}
      <View style={styles.actionsContainer}>
        {/* Favorite button */}
        <Pressable
          onPress={handleFavoritePress}
          style={styles.actionButton}
          hitSlop={12}
        >
          <Animated.View style={{ transform: [{ scale: heartScale }] }}>
            <Ionicons
              name={favorite ? "heart" : "heart-outline"}
              size={28}
              color={favorite ? theme.colors.error : theme.colors.foregroundSecondary}
            />
          </Animated.View>
        </Pressable>

        {/* Share button */}
        <Pressable onPress={handleShare} style={styles.actionButton} hitSlop={12}>
          <Ionicons
            name="share-outline"
            size={26}
            color={theme.colors.foregroundSecondary}
          />
        </Pressable>

        {/* Refresh button */}
        {showRefreshButton && onRefresh && (
          <Pressable onPress={handleRefresh} style={styles.actionButton} hitSlop={12}>
            <Ionicons
              name="refresh-outline"
              size={26}
              color={theme.colors.foregroundSecondary}
            />
          </Pressable>
        )}
      </View>
    </Animated.View>
  )
}

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius["3xl"],
    padding: theme.spacing.xl,
    paddingVertical: theme.spacing["2xl"],
    marginHorizontal: theme.spacing.md,
    ...theme.shadows.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: 280,
    justifyContent: "center",
  },
  quoteContainer: {
    position: "absolute",
    top: theme.spacing.lg,
    left: theme.spacing.xl,
  },
  quoteContainerBottom: {
    position: "absolute",
    bottom: theme.spacing.lg + 48,
    right: theme.spacing.xl,
    transform: [{ rotate: "180deg" }],
  },
  quoteMark: {
    fontSize: 72,
    fontFamily: "Georgia",
    color: theme.colors.primary,
    opacity: 0.15,
    lineHeight: 72,
  },
  affirmationText: {
    fontSize: 24,
    fontFamily: "Georgia",
    fontWeight: "500",
    color: theme.colors.foreground,
    textAlign: "center",
    lineHeight: 36,
    letterSpacing: 0.3,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xl,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginTop: theme.spacing.lg,
  },
  actionButton: {
    padding: theme.spacing.sm,
  },
}))
