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
import { H1, YStack } from "tamagui";

export default function App() {
  const router = useRouter();
  const actions = useGameActions();

  const handleInitGame = () => {
    // console.log("init game");

    // expo router push
    router.push("/game");
    actions.handleAdvanceGameRound();
  };

  const headerHeight = 60;

  return (
    <YStack
      bg={"$background"}
      alignItems="center"
      flex={1}
      flexDirection="column"
      justifyContent="center"
    >
      <Image
        source={JustPokerLogo}
        style={{
          height: 100,
          width: 100,
          borderRadius: 10,
        }}
      />
      <H1 fontWeight={"bold"} mt="4">
        Just Poker
      </H1>
      <PokerText
        fontWeight="light"
        style={{ fontSize: 18, marginBottom: 30, marginTop: 0 }}
      >
        by curi studios
      </PokerText>
      <Button
        onPress={handleInitGame}
        icon="play"
        style={{ marginBottom: 10, width: 200 }}
      >
        Start Match
      </Button>
      <Button
        onPress={handleInitGame}
        icon="settings"
        style={{ marginBottom: 10, width: 200 }}
      >
        Settings
      </Button>
      <PokerText fontWeight="light" style={{ fontSize: 12, marginTop: 0 }}>
        v{Constants.manifest.version}
      </PokerText>
    </YStack>
  );
}
