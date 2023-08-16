import { Slot, SplashScreen } from "expo-router";
import { TamaguiProvider } from "tamagui";

import config from "../tamagui.config";
import { useColorScheme } from "react-native";
import { useFonts } from "expo-font";
import { useCallback } from "react";

export default function AppLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (loaded) {
      await SplashScreen.hideAsync();
    }
  }, [loaded]);

  return (
    <TamaguiProvider config={config}>
      <Slot />
    </TamaguiProvider>
  );
}
