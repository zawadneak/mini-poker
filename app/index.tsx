import styled from "styled-components/native";
import Container from "../components/Container";
import Button from "../components/Button";
import { useRouter } from "expo-router";
import useGame from "../store/game";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const router = useRouter();
  const { actions } = useGame();

  const [fontsLoaded] = useFonts({
    Ubuntu: require("../assets/fonts/Ubuntu/Ubuntu-Regular.ttf"),
    "Ubuntu-Bold": require("../assets/fonts/Ubuntu/Ubuntu-Bold.ttf"),
    "Ubuntu-Light": require("../assets/fonts/Ubuntu/Ubuntu-Light.ttf"),
    "Ubuntu-Medium": require("../assets/fonts/Ubuntu/Ubuntu-Medium.ttf"),
    "Ubuntu-Regular": require("../assets/fonts/Ubuntu/Ubuntu-Regular.ttf"),
    "Ubuntu-Italic": require("../assets/fonts/Ubuntu/Ubuntu-Italic.ttf"),
    "Ubuntu-BoldItalic": require("../assets/fonts/Ubuntu/Ubuntu-BoldItalic.ttf"),
    "Ubuntu-LightItalic": require("../assets/fonts/Ubuntu/Ubuntu-LightItalic.ttf"),
    "Ubuntu-MediumItalic": require("../assets/fonts/Ubuntu/Ubuntu-MediumItalic.ttf"),
  });

  const handleInitGame = () => {
    console.log("init game");

    actions.shuffleDeck();

    // expo router push
    router.push("/game");
  };

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  return (
    <Container
      justifyContent="center"
      alignItems="center"
      onLayout={onLayoutRootView}
    >
      <Title>MiniPoker</Title>
      <Button onPress={handleInitGame} icon="cards">
        New Game
      </Button>
    </Container>
  );
}

const Title = styled.Text`
  font-family: "Ubuntu-Bold";
  margin-bottom: 20;
  font-size: 24px;
`;
