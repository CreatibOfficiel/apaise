// For documentation on adding custom fonts, see the "Custom Fonts" section in:
// - shipnativeapp/docs/DESIGN_SYSTEM.md

import { Platform } from "react-native"
import {
  CormorantGaramond_400Regular as cormorantRegular,
  CormorantGaramond_500Medium as cormorantMedium,
  CormorantGaramond_600SemiBold as cormorantSemiBold,
  CormorantGaramond_700Bold as cormorantBold,
  CormorantGaramond_400Regular_Italic as cormorantItalic,
  CormorantGaramond_500Medium_Italic as cormorantMediumItalic,
  CormorantGaramond_700Bold_Italic as cormorantBoldItalic,
} from "@expo-google-fonts/cormorant-garamond"
import {
  SpaceGrotesk_300Light as spaceGroteskLight,
  SpaceGrotesk_400Regular as spaceGroteskRegular,
  SpaceGrotesk_500Medium as spaceGroteskMedium,
  SpaceGrotesk_600SemiBold as spaceGroteskSemiBold,
  SpaceGrotesk_700Bold as spaceGroteskBold,
} from "@expo-google-fonts/space-grotesk"

export const customFontsToLoad = {
  spaceGroteskLight,
  spaceGroteskRegular,
  spaceGroteskMedium,
  spaceGroteskSemiBold,
  spaceGroteskBold,
  cormorantRegular,
  cormorantMedium,
  cormorantSemiBold,
  cormorantBold,
  cormorantItalic,
  cormorantMediumItalic,
  cormorantBoldItalic,
}

const fonts = {
  spaceGrotesk: {
    // Cross-platform Google font.
    light: "spaceGroteskLight",
    normal: "spaceGroteskRegular",
    medium: "spaceGroteskMedium",
    semiBold: "spaceGroteskSemiBold",
    bold: "spaceGroteskBold",
  },
  helveticaNeue: {
    // iOS only font.
    thin: "HelveticaNeue-Thin",
    light: "HelveticaNeue-Light",
    normal: "Helvetica Neue",
    medium: "HelveticaNeue-Medium",
  },
  courier: {
    // iOS only font.
    normal: "Courier",
  },
  sansSerif: {
    // Android only font.
    thin: "sans-serif-thin",
    light: "sans-serif-light",
    normal: "sans-serif",
    medium: "sans-serif-medium",
  },
  monospace: {
    // Android only font.
    normal: "monospace",
  },
  cormorantGaramond: {
    // Serif font for affirmations (Cross-platform Google font)
    regular: "cormorantRegular",
    medium: "cormorantMedium",
    semiBold: "cormorantSemiBold",
    bold: "cormorantBold",
    italic: "cormorantItalic",
    mediumItalic: "cormorantMediumItalic",
    boldItalic: "cormorantBoldItalic",
  },
}

export const typography = {
  /**
   * The fonts are available to use, but prefer using the semantic name.
   */
  fonts,
  /**
   * The primary font. Used in most places.
   */
  primary: fonts.spaceGrotesk,
  /**
   * An alternate font used for perhaps titles and stuff.
   */
  secondary: Platform.select({ ios: fonts.helveticaNeue, android: fonts.sansSerif }),
  /**
   * Lets get fancy with a monospace font!
   */
  code: Platform.select({ ios: fonts.courier, android: fonts.monospace }),
  /**
   * Elegant serif font for affirmations (Cormorant Garamond)
   */
  serif: fonts.cormorantGaramond,
}
