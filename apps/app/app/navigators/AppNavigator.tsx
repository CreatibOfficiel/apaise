/**
 * App Navigator - Simplified for affirmations app (I AM style)
 *
 * Flow: Onboarding → Main (no auth required)
 * Auth is optional and available in Settings for sync/backup
 */
import { useEffect } from "react"
import { Platform } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { UnistylesRuntime, useUnistyles } from "react-native-unistyles"

import { Spinner } from "@/components/Spinner"
import Config from "@/config"
import * as Screens from "@/screens"
import { ErrorBoundary } from "@/screens/ErrorScreen/ErrorBoundary"
import { useOnboardingStore } from "@/stores"
import { webDimension } from "@/types/webStyles"
import { logger } from "@/utils/Logger"

import { MainTabNavigator } from "./MainTabNavigator"
import type { AppStackParamList, NavigationProps } from "./navigationTypes"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = () => {
  const hasCompletedOnboarding = useOnboardingStore((state) => state.isCompleted)
  const isWeb = Platform.OS === "web"
  const { theme } = useUnistyles()
  const navigationBarColor = theme.colors.palette.neutral900
  const statusBarStyle = UnistylesRuntime.themeName === "dark" ? "light" : "dark"

  if (__DEV__) {
    logger.debug("AppStack rendering", {
      hasCompletedOnboarding,
    })
  }

  // Determine initial route - simple: Onboarding or Main
  const initialRouteName: keyof AppStackParamList = hasCompletedOnboarding ? "Main" : "Onboarding"

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor,
        statusBarStyle,
        contentStyle: {
          flex: 1,
          backgroundColor: theme.colors.background,
          ...(isWeb && {
            minHeight: webDimension("100vh"),
            height: webDimension("100vh"),
            width: webDimension("100vw"),
            maxWidth: webDimension("100vw"),
          }),
        },
        animation: "default",
      }}
      initialRouteName={initialRouteName}
    >
      {hasCompletedOnboarding ? (
        // ------------------------------------------------------------------
        // MAIN APP STACK (after onboarding)
        // ------------------------------------------------------------------
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen
            name="Paywall"
            component={Screens.PaywallScreen}
            options={{
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="DataDemo"
            component={Screens.DataDemoScreen}
            options={{
              animation: "slide_from_right",
            }}
          />
          {/* Auth screens - optional, accessible from Settings */}
          <Stack.Screen
            name="Login"
            component={Screens.LoginScreen}
            options={{
              animation: "slide_from_right",
              presentation: "modal",
            }}
          />
          <Stack.Screen
            name="Register"
            component={Screens.RegisterScreen}
            options={{
              animation: "slide_from_right",
              presentation: "modal",
            }}
          />
        </>
      ) : (
        // ------------------------------------------------------------------
        // ONBOARDING STACK (first launch)
        // ------------------------------------------------------------------
        <>
          <Stack.Screen
            name="Onboarding"
            component={Screens.OnboardingScreen}
            options={{
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="Paywall"
            component={Screens.PaywallScreen}
            options={{
              gestureEnabled: false,
            }}
          />
        </>
      )}
    </Stack.Navigator>
  )
}

export const AppNavigator = (props: NavigationProps) => {
  const { theme } = useUnistyles()

  // Map Unistyles theme to React Navigation theme
  const navigationTheme = {
    dark: UnistylesRuntime.themeName === "dark",
    colors: {
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.card,
      text: theme.colors.foreground,
      border: theme.colors.border,
      notification: theme.colors.primary,
    },
    fonts: {
      regular: {
        fontFamily: theme.typography.fonts.regular,
        fontWeight: "400" as const,
      },
      medium: {
        fontFamily: theme.typography.fonts.medium,
        fontWeight: "500" as const,
      },
      bold: {
        fontFamily: theme.typography.fonts.bold,
        fontWeight: "700" as const,
      },
      heavy: {
        fontFamily: theme.typography.fonts.bold,
        fontWeight: "900" as const,
      },
    },
  }

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <NavigationContainer ref={navigationRef} theme={navigationTheme} {...props}>
      <ErrorBoundary catchErrors={Config.catchErrors}>
        <AppStack />
      </ErrorBoundary>
    </NavigationContainer>
  )
}
