import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { render } from "@testing-library/react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"

import "../app/theme/unistyles"
import { QueryProvider } from "../app/providers"
import { LoginScreen } from "../app/screens/LoginScreen"
import { ThemeProvider } from "../app/theme/context"

const Stack = createNativeStackNavigator()

describe("LoginScreen", () => {
  it("renders without crashing", () => {
    const { getByText } = render(
      <SafeAreaProvider>
        <QueryProvider>
          <ThemeProvider>
            <NavigationContainer>
              <Stack.Navigator>
                <Stack.Screen name="Login" component={LoginScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </ThemeProvider>
        </QueryProvider>
      </SafeAreaProvider>,
    )

    expect(getByText("Welcome Back")).toBeTruthy()
  })
})
