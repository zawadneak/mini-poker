import { Slot, SplashScreen } from "expo-router";
import { TamaguiProvider } from "tamagui";

import config from "../tamagui.config";
import { useColorScheme } from "react-native";
import { useFonts } from "expo-font";
import { useCallback } from "react";
import Head from "expo-router/head";

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
    <>
      <Head>
        <meta
          name="description"
          content="Welcome to JustPoker, the ultimate  poker experience. Join us for exciting games and strategic gameplay."
        />
        <meta
          name="keywords"
          content="JustPoker, poker, poker game, card game, strategy, entertainment"
        />
        <meta name="author" content="Your Game Studio Name" />

        <title>JustPoker</title>

        <link rel="icon" href="favicon.ico" type="image/x-icon" />

        <meta property="og:title" content="JustPoker" />
        <meta
          property="og:description"
          content="Join JustPoker for exciting  poker games and strategic gameplay. Immerse yourself in the world of cards and strategy."
        />
        <meta property="og:image" content="og-image.jpg" />
        <meta property="og:url" content="https://justpoker.curistudios.com" />
        <meta property="og:type" content="website" />

        {/* <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="JustPoker" />
        <meta
          name="twitter:description"
          content="Join JustPoker for exciting poker games and strategic gameplay. Immerse yourself in the world of cards and strategy."
        />
        <meta name="twitter:image" content="twitter-image.jpg" />
        <meta name="twitter:creator" content="@YourTwitterHandle" /> */}
      </Head>

      <TamaguiProvider config={config}>
        <Slot />
      </TamaguiProvider>
    </>
  );
}
