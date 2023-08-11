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
      style={{ paddingTop: headerHeight }}
    >
      <PokerText fontWeight="bold" style={{ fontSize: 42, marginBottom: 30 }}>
        JustPoker
      </PokerText>
      <Button
        onPress={handleInitGame}
        icon="cards"
        style={{ marginBottom: 10 }}
      >
        New Game
      </Button>
      <Button onPress={handleInitGame} icon="cog">
        Settings
      </Button>
    </Container>
  );
}
