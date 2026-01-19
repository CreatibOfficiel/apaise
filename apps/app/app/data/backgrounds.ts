/**
 * Background Images for Affirmation Feed
 *
 * MVP: Using placeholder gradient backgrounds
 * TODO: Replace with actual images from assets/backgrounds/
 *
 * To add actual images:
 * 1. Add images to assets/backgrounds/ (1080x1920 portrait JPG)
 * 2. Import them here and update the BACKGROUNDS array
 *
 * Suggested images from Unsplash:
 * - sunset-water.jpg - Sunset over water
 * - mountain-mist.jpg - Misty mountains
 * - forest-light.jpg - Forest with light rays
 * - ocean-calm.jpg - Calm ocean
 * - stars-night.jpg - Starry night sky
 * - meadow-sunrise.jpg - Meadow at sunrise
 * - clouds-soft.jpg - Soft clouds
 * - lake-reflection.jpg - Lake with reflections
 * - desert-dunes.jpg - Sand dunes
 * - autumn-trees.jpg - Autumn trees
 */

import { ImageSourcePropType } from "react-native"

export interface BackgroundConfig {
  id: string
  /** Image source - use require() for local images */
  source?: ImageSourcePropType
  /** Fallback gradient colors if no image */
  gradientColors: [string, string, string]
  /** Overlay opacity for text readability (0-1) */
  overlayOpacity: number
}

/**
 * Background configurations for the affirmation feed
 * Each background has a gradient fallback for when images aren't loaded
 */
export const BACKGROUNDS: BackgroundConfig[] = [
  {
    id: "sunset-water",
    gradientColors: ["#FF6B6B", "#FF8E72", "#FFC478"],
    overlayOpacity: 0.3,
  },
  {
    id: "mountain-mist",
    gradientColors: ["#667EEA", "#764BA2", "#A855F7"],
    overlayOpacity: 0.35,
  },
  {
    id: "forest-light",
    gradientColors: ["#134E5E", "#71B280", "#A8E6CF"],
    overlayOpacity: 0.3,
  },
  {
    id: "ocean-calm",
    gradientColors: ["#2193B0", "#6DD5ED", "#B5FFFC"],
    overlayOpacity: 0.25,
  },
  {
    id: "stars-night",
    gradientColors: ["#0F0C29", "#302B63", "#24243E"],
    overlayOpacity: 0.2,
  },
  {
    id: "meadow-sunrise",
    gradientColors: ["#F093FB", "#F5576C", "#FFD89B"],
    overlayOpacity: 0.3,
  },
  {
    id: "clouds-soft",
    gradientColors: ["#E0C3FC", "#8EC5FC", "#FFFFFF"],
    overlayOpacity: 0.2,
  },
  {
    id: "lake-reflection",
    gradientColors: ["#4CA1AF", "#2C3E50", "#1A1A2E"],
    overlayOpacity: 0.35,
  },
  {
    id: "desert-dunes",
    gradientColors: ["#D4A574", "#E6B98A", "#F5DEB3"],
    overlayOpacity: 0.25,
  },
  {
    id: "autumn-trees",
    gradientColors: ["#CB356B", "#BD3F32", "#F5AF19"],
    overlayOpacity: 0.3,
  },
]

/**
 * Get a background for a given index (cycles through available backgrounds)
 */
export const getBackgroundForIndex = (index: number): BackgroundConfig => {
  return BACKGROUNDS[index % BACKGROUNDS.length]
}

/**
 * Get a random background
 */
export const getRandomBackground = (): BackgroundConfig => {
  const randomIndex = Math.floor(Math.random() * BACKGROUNDS.length)
  return BACKGROUNDS[randomIndex]
}
