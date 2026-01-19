/**
 * HomeScreen - TikTok-like Affirmation Feed
 *
 * Full screen vertical swipe feed of affirmations
 * - Fixed background gradient
 * - Fixed header buttons (Profile / Premium)
 * - Only affirmation text + action buttons scroll
 */

import { FC, useEffect, useCallback, useState, useRef, useMemo } from "react"
import {
  View,
  Platform,
  ActivityIndicator,
  FlatList,
  useWindowDimensions,
  Pressable,
  Share,
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
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { Text } from "@/components"
import type { MainTabScreenProps } from "@/navigators/navigationTypes"
import { getAffirmationText } from "@/services/affirmationService"
import {
  useAffirmationFeedStore,
  useOnboardingStore,
  useSubscriptionStore,
  selectHasSeenSwipeHint,
} from "@/stores"
import type { FeedItem } from "@/stores/affirmationFeedStore"
import { haptics, hapticImpact } from "@/utils/haptics"

// =============================================================================
// TYPES
// =============================================================================

interface HomeScreenProps extends MainTabScreenProps<"Home"> {}

// =============================================================================
// COMPONENT
// =============================================================================

export const HomeScreen: FC<HomeScreenProps> = function HomeScreen({ navigation }) {
  // All hooks must be at the top, before any conditional returns
  const [isReady, setIsReady] = useState(false)
  const [containerHeight, setContainerHeight] = useState(0)
  const [showHeartAnimation, setShowHeartAnimation] = useState(false)
  const flatListRef = useRef<FlatList<FeedItem>>(null)
  const lastTapRef = useRef<number>(0)
  const { height: windowHeight } = useWindowDimensions()
  const { theme } = useUnistyles()
  const insets = useSafeAreaInsets()
  const { i18n, t } = useTranslation()

  // Animation values
  const heartScale = useSharedValue(0)
  const heartOpacity = useSharedValue(0)
  const favoriteButtonScale = useSharedValue(1)

  // Use container height if available, otherwise fall back to window height
  const screenHeight = containerHeight > 0 ? containerHeight : windowHeight
  const lang = i18n.language.startsWith("fr") ? "fr" : "en"

  // Stores
  const isPro = useSubscriptionStore((state) => state.isPro)
  const userCategory = useOnboardingStore((state) => state.answers.transform_domain as string)
  const feedItems = useAffirmationFeedStore((state) => state.feedItems)
  const currentIndex = useAffirmationFeedStore((state) => state.currentIndex)
  const setCurrentIndex = useAffirmationFeedStore((state) => state.setCurrentIndex)
  const loadFeed = useAffirmationFeedStore((state) => state.loadFeed)
  const toggleFavorite = useAffirmationFeedStore((state) => state.toggleFavorite)
  const isFavorite = useAffirmationFeedStore((state) => state.isFavorite)
  const hasSeenSwipeHint = useAffirmationFeedStore(selectHasSeenSwipeHint)
  const markSwipeHintSeen = useAffirmationFeedStore((state) => state.markSwipeHintSeen)

  // Current item
  const currentItem = feedItems[currentIndex]
  const currentBackground = currentItem?.background
  const isCurrentFavorite = currentItem ? isFavorite(currentItem.affirmation.id) : false

  // Viewability config - must be stable reference
  const viewabilityConfig = useMemo(
    () => ({
      itemVisiblePercentThreshold: 50,
    }),
    [],
  )

  // Load feed on mount
  useEffect(() => {
    if (feedItems.length === 0) {
      loadFeed(userCategory || undefined, isPro)
    }

    const timer = setTimeout(() => {
      setIsReady(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Reload feed when category changes
  useEffect(() => {
    if (isReady && feedItems.length === 0) {
      loadFeed(userCategory || undefined, isPro)
    }
  }, [isReady, feedItems.length, loadFeed, userCategory, isPro])

  // Handlers
  const handleProfilePress = useCallback(() => {
    haptics.buttonPress()
    navigation.navigate("Profile")
  }, [navigation])

  const handlePremiumPress = useCallback(() => {
    haptics.buttonPress()
    navigation.navigate("Paywall")
  }, [navigation])

  const handleDoubleTap = useCallback(() => {
    if (!currentItem) return
    if (!isCurrentFavorite) {
      toggleFavorite(currentItem.affirmation.id)
    }
    hapticImpact.medium()

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
  }, [currentItem, isCurrentFavorite, toggleFavorite, heartScale, heartOpacity])

  const handlePress = useCallback(() => {
    const now = Date.now()
    if (now - lastTapRef.current < 300) {
      handleDoubleTap()
    } else if (!hasSeenSwipeHint) {
      markSwipeHintSeen()
    }
    lastTapRef.current = now
  }, [handleDoubleTap, hasSeenSwipeHint, markSwipeHintSeen])

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        const newIndex = viewableItems[0].index
        setCurrentIndex(newIndex)

        if (!hasSeenSwipeHint && newIndex > 0) {
          markSwipeHintSeen()
        }
      }
    },
    [setCurrentIndex, hasSeenSwipeHint, markSwipeHintSeen],
  )

  // Animated styles - must be declared before renderItem which uses them
  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
    opacity: heartOpacity.value,
  }))

  const favoriteAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: favoriteButtonScale.value }],
  }))

  const renderItem = useCallback(
    ({ item, index }: { item: FeedItem; index: number }) => {
      const text = getAffirmationText(item.affirmation, lang)
      const isItemFavorite = isFavorite(item.affirmation.id)

      const handleItemShare = async () => {
        haptics.buttonPress()
        try {
          await Share.share({ message: text })
        } catch {
          // User cancelled
        }
      }

      const handleItemFavorite = () => {
        hapticImpact.light()
        favoriteButtonScale.value = withSequence(
          withSpring(1.3, { damping: 8 }),
          withSpring(1, { damping: 8 }),
        )
        toggleFavorite(item.affirmation.id)
      }

      return (
        <Pressable
          style={[styles.page, { height: screenHeight }]}
          onPress={handlePress}
        >
          {/* Text centered on screen */}
          <View style={styles.centeredTextContainer}>
            <Animated.View entering={FadeIn.duration(400)} style={styles.textContainer}>
              <Text style={styles.affirmationText}>{text}</Text>
            </Animated.View>
          </View>

          {/* Action buttons - positioned below center */}
          <View style={styles.itemActionsRow}>
            <Pressable style={styles.actionButton} onPress={handleItemShare}>
              <Ionicons name="share-outline" size={28} color="#FFFFFF" />
            </Pressable>

            <Animated.View style={index === currentIndex ? favoriteAnimatedStyle : undefined}>
              <Pressable style={styles.actionButton} onPress={handleItemFavorite}>
                <Ionicons
                  name={isItemFavorite ? "heart" : "heart-outline"}
                  size={28}
                  color={isItemFavorite ? "#FF6B6B" : "#FFFFFF"}
                />
              </Pressable>
            </Animated.View>
          </View>
        </Pressable>
      )
    },
    [screenHeight, lang, handlePress, isFavorite, toggleFavorite, favoriteButtonScale, currentIndex, favoriteAnimatedStyle],
  )

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: screenHeight,
      offset: screenHeight * index,
      index,
    }),
    [screenHeight],
  )

  const keyExtractor = useCallback((item: FeedItem) => item.affirmation.id, [])

  const handleContainerLayout = useCallback(
    (event: { nativeEvent: { layout: { height: number } } }) => {
      const { height } = event.nativeEvent.layout
      if (height > 0 && height !== containerHeight) {
        setContainerHeight(height)
      }
    },
    [containerHeight],
  )

  // Show loading state
  if (!isReady || feedItems.length === 0 || containerHeight === 0) {
    return (
      <View style={[styles.container, styles.loadingContainer]} onLayout={handleContainerLayout}>
        <ActivityIndicator size="large" color="#8B7769" />
      </View>
    )
  }

  const gradientColors = currentBackground?.gradientColors || ["#667EEA", "#764BA2", "#A855F7"]

  return (
    <View style={styles.container} onLayout={handleContainerLayout}>
      {/* Fixed Background */}
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      />

      {/* Dark Overlay */}
      <View style={[styles.overlay, { backgroundColor: `rgba(0, 0, 0, ${currentBackground?.overlayOpacity || 0.3})` }]} />

      {/* Fixed Header */}
      <View style={[styles.header, { paddingTop: insets.top + theme.spacing.md }]}>
        <Pressable style={styles.headerButton} onPress={handleProfilePress}>
          <Ionicons name="person" size={22} color="#FFFFFF" />
        </Pressable>

        <Pressable style={styles.headerButton} onPress={handlePremiumPress}>
          <Ionicons name="diamond" size={22} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* Scrollable Content (only text) */}
      <FlatList
        ref={flatListRef}
        data={feedItems}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={screenHeight}
        snapToAlignment="start"
        decelerationRate="fast"
        bounces={false}
        overScrollMode="never"
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={getItemLayout}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={3}
        removeClippedSubviews={Platform.OS === "android"}
        style={styles.flatList}
      />

      {/* Swipe Hint - Fixed at bottom */}
      {!hasSeenSwipeHint && (
        <Animated.View
          entering={FadeIn.delay(1000)}
          style={[styles.swipeHintContainer, { paddingBottom: insets.bottom + theme.spacing.lg }]}
        >
          <Ionicons name="chevron-up" size={20} color="rgba(255, 255, 255, 0.5)" />
          <Text style={styles.swipeHintText}>
            {lang === "fr" ? "Balayez vers le haut" : "Swipe up"}
          </Text>
        </Animated.View>
      )}

      {/* Heart Animation (Double-tap) */}
      {showHeartAnimation && (
        <Animated.View style={[styles.heartAnimationContainer, heartAnimatedStyle]}>
          <Ionicons name="heart" size={120} color="#FFFFFF" />
        </Animated.View>
      )}
    </View>
  )
}

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  // Fixed Header
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    zIndex: 10,
  },
  headerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(139, 119, 101, 0.7)",
    alignItems: "center",
    justifyContent: "center",
  },

  // Scrollable Content
  flatList: {
    flex: 1,
  },
  page: {
    flex: 1,
    alignItems: "center",
  },
  centeredTextContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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

  // Action buttons - positioned below center
  itemActionsRow: {
    position: "absolute",
    top: "60%",
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

  // Swipe Hint (fixed at bottom)
  swipeHintContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    gap: theme.spacing.xs,
    zIndex: 10,
  },
  swipeHintText: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.sm,
    color: "rgba(255, 255, 255, 0.5)",
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
    pointerEvents: "none",
  },
}))
