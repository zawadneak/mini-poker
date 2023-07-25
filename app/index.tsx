import styled from "styled-components/native";
import Container from "../components/Container";
import Button from "../components/Button";
import { useRouter } from "expo-router";
import useGame from "../store/game";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import useGameActions from "../store/game/actions";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const router = useRouter();
  const actions = useGameActions();

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
      <Title
        style={
          {
            // fontFamily: "Ubuntu-Bold",
          }
        }
      >
        MiniPoker
      </Title>
      <Button onPress={handleInitGame} icon="cards">
        New Game
      </Button>
    </Container>
  );
}

const Title = styled.Text`
  margin-bottom: 20px;
  font-size: 24px;
`;
