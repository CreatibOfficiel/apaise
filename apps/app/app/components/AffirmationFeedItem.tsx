/**
 * AffirmationFeedItem - Full screen affirmation component for TikTok-like feed
 *
 * Displays:
 * - Full screen background (gradient or image)
 * - Centered affirmation text (serif font, white, with shadow)
 * - Header buttons: Profile (left) and Premium (right)
 * - Bottom action buttons: Share and Favorite
 * - Swipe hint for first-time users
 * - Double-tap to like animation
 */

import { FC, useCallback, useRef, useState } from "react"
import {
  View,
  Pressable,
  Share,
  GestureResponderEvent,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useTranslation } from "react-i18next"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  runOnJS,
  FadeIn,
  FadeOut,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import type { BackgroundConfig } from "@/data/backgrounds"
import type { Affirmation } from "@/services/affirmationService"
import { getAffirmationText } from "@/services/affirmationService"
import { haptics, hapticImpact } from "@/utils/haptics"

import { Text } from "./Text"

// =============================================================================
// TYPES
// =============================================================================

interface AffirmationFeedItemProps {
  affirmation: Affirmation
  background: BackgroundConfig
  isActive: boolean
  isFavorite: boolean
  showSwipeHint: boolean
  onToggleFavorite: () => void
  onShare: () => void
  onProfilePress: () => void
  onPremiumPress: () => void
  onSwipeHintSeen: () => void
}

// =============================================================================
// CONSTANTS
// =============================================================================

const DOUBLE_TAP_DELAY = 300

// =============================================================================
// COMPONENT
// =============================================================================

export const AffirmationFeedItem: FC<AffirmationFeedItemProps> = ({
  affirmation,
  background,
  isActive,
  isFavorite,
  showSwipeHint,
  onToggleFavorite,
  onShare,
  onProfilePress,
  onPremiumPress,
  onSwipeHintSeen,
}) => {
  const { theme } = useUnistyles()
  const insets = useSafeAreaInsets()
  const { i18n, t } = useTranslation()

  const lang = i18n.language.startsWith("fr") ? "fr" : "en"
  const affirmationText = getAffirmationText(affirmation, lang)

  // Double-tap detection
  const lastTapRef = useRef<number>(0)
  const [showHeartAnimation, setShowHeartAnimation] = useState(false)

  // Animation values
  const heartScale = useSharedValue(0)
  const heartOpacity = useSharedValue(0)
  const favoriteButtonScale = useSharedValue(1)

  // Handle double tap to like
  const handleDoubleTap = useCallback(() => {
    if (!isFavorite) {
      onToggleFavorite()
    }
    hapticImpact.medium()

    // Show heart animation
    setShowHeartAnimation(true)
    heartScale.value = withSequence(
      withSpring(1.2, { damping: 8, stiffness: 200 }),
      withTiming(1, { duration: 100 }),
      withTiming(0, { duration: 300 }),
    )
    heartOpacity.value = withSequence(
      withTiming(1, { duration: 100 }),
      withTiming(1, { duration: 400 }),
      withTiming(0, { duration: 300 }, () => {
        runOnJS(setShowHeartAnimation)(false)
      }),
    )
  }, [isFavorite, onToggleFavorite, heartScale, heartOpacity])

  const handlePress = (event: GestureResponderEvent) => {
    const now = Date.now()
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      handleDoubleTap()
    } else {
      // Single tap - dismiss swipe hint
      if (showSwipeHint) {
        onSwipeHintSeen()
      }
    }
    lastTapRef.current = now
  }

  // Handle favorite button press
  const handleFavoritePress = () => {
    hapticImpact.light()
    favoriteButtonScale.value = withSequence(
      withSpring(1.3, { damping: 8 }),
      withSpring(1, { damping: 8 }),
    )
    onToggleFavorite()
  }

  // Handle share
  const handleShare = async () => {
    haptics.buttonPress()
    try {
      await Share.share({
        message: affirmationText,
        title: t("share:title"),
      })
    } catch {
      // User cancelled or error
    }
    onShare()
  }

  // Animated styles
  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
    opacity: heartOpacity.value,
  }))

  const favoriteAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: favoriteButtonScale.value }],
  }))

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      {/* Background Gradient */}
      <LinearGradient
        colors={background.gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Dark Overlay for text readability */}
        <View
          style={[
            styles.overlay,
            { backgroundColor: `rgba(0, 0, 0, ${background.overlayOpacity})` },
          ]}
        />

        {/* Header - Profile & Premium buttons */}
        <View style={[styles.header, { paddingTop: insets.top + theme.spacing.md }]}>
          <Pressable style={styles.headerButton} onPress={onProfilePress}>
            <Ionicons name="person" size={22} color="#FFFFFF" />
          </Pressable>

          <Pressable style={styles.headerButton} onPress={onPremiumPress}>
            <Ionicons name="diamond" size={22} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Centered Affirmation Text */}
        <View style={styles.contentContainer}>
          {isActive && (
            <Animated.View entering={FadeIn.duration(600)} style={styles.textContainer}>
              <Text style={styles.affirmationText}>{affirmationText}</Text>
            </Animated.View>
          )}
        </View>

        {/* Heart Animation (Double-tap) */}
        {showHeartAnimation && (
          <Animated.View style={[styles.heartAnimationContainer, heartAnimatedStyle]}>
            <Ionicons name="heart" size={120} color="#FFFFFF" />
          </Animated.View>
        )}

        {/* Bottom Actions - Share & Favorite */}
        <View style={[styles.actionsContainer, { paddingBottom: insets.bottom + theme.spacing.xl }]}>
          <View style={styles.actionsRow}>
            <Pressable style={styles.actionButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={28} color="#FFFFFF" />
            </Pressable>

            <Animated.View style={favoriteAnimatedStyle}>
              <Pressable style={styles.actionButton} onPress={handleFavoritePress}>
                <Ionicons
                  name={isFavorite ? "heart" : "heart-outline"}
                  size={28}
                  color={isFavorite ? "#FF6B6B" : "#FFFFFF"}
                />
              </Pressable>
            </Animated.View>
          </View>

          {/* Swipe Hint */}
          {showSwipeHint && isActive && (
            <Animated.View entering={FadeIn.delay(1000)} exiting={FadeOut} style={styles.swipeHint}>
              <Ionicons name="chevron-up" size={20} color="rgba(255, 255, 255, 0.5)" />
              <Text style={styles.swipeHintText}>
                {lang === "fr" ? "Balayez vers le haut" : "Swipe up"}
              </Text>
            </Animated.View>
          )}
        </View>
      </LinearGradient>
    </Pressable>
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
    position: "relative",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    zIndex: 10,
  },
  headerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(139, 119, 101, 0.7)", // Taupe color
    alignItems: "center",
    justifyContent: "center",
  },

  // Content
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.xl,
  },
  textContainer: {
    maxWidth: 340,
  },
  affirmationText: {
    fontFamily: theme.typography.fonts.serifMedium,
    fontSize: 28,
    lineHeight: 40,
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  // Heart Animation
  heartAnimationContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },

  // Actions
  actionsContainer: {
    alignItems: "center",
    gap: theme.spacing.lg,
    zIndex: 10,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xl,
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },

  // Swipe Hint
  swipeHint: {
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  swipeHintText: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.sm,
    color: "rgba(255, 255, 255, 0.5)",
  },
}))
