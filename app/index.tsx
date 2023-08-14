import styled from "styled-components/native";
import Container from "../components/Container";
import Button from "../components/Button";
import { useRouter } from "expo-router";
import useGame from "../store/game";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import useGameActions from "../store/game/actions";
import PokerText from "../components/Text";
import { Image } from "react-native";

import Constants from "expo-constants";

import JustPokerLogo from "../assets/branding/just-poker.png";
import colors from "../styles/colors";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const router = useRouter();
  const actions = useGameActions();

  const [fontsLoaded] = useFonts({
    "Ubuntu-Bold": require("../assets/fonts/Ubuntu/Ubuntu-Bold.ttf"),
    "Ubuntu-Light": require("../assets/fonts/Ubuntu/Ubuntu-Light.ttf"),
    "Ubuntu-Medium": require("../assets/fonts/Ubuntu/Ubuntu-Medium.ttf"),
    "Ubuntu-Regular": require("../assets/fonts/Ubuntu/Ubuntu-Regular.ttf"),
  });

  const handleInitGame = () => {
    // console.log("init game");

    // expo router push
    router.push("/game");
    actions.handleAdvanceGameRound();
  };

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const headerHeight = 60;

  return (
    <Container
      justifyContent="center"
      alignItems="center"
      onLayout={onLayoutRootView}
      style={{ paddingTop: headerHeight, backgroundColor: colors.primary }}
    >
      <Image
        source={JustPokerLogo}
        style={{
          height: 100,
          width: 100,
          borderRadius: 10,
        }}
      />
      <PokerText fontWeight="bold" style={{ fontSize: 36, marginTop: 10 }}>
        JustPoker
      </PokerText>{" "}
      <PokerText
        fontWeight="light"
        style={{ fontSize: 18, marginBottom: 30, marginTop: 0 }}
      >
        by curi studios
      </PokerText>
      <Button
        onPress={handleInitGame}
        icon="cards"
        style={{ marginBottom: 10, width: 200 }}
      >
        Start Match
      </Button>
      <Button
        onPress={handleInitGame}
        icon="cog"
        style={{ marginBottom: 10, width: 200 }}
      >
        Settings
      </Button>
      <PokerText fontWeight="light" style={{ fontSize: 12, marginTop: 0 }}>
        v{Constants.manifest.version}
      </PokerText>
    </Container>
  );
}
