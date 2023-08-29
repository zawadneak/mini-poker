import styled from "styled-components/native";
import Container from "../components/Container";
import Button from "../components/Button";
import { useRouter } from "expo-router";
import useGame from "../store/game";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useMemo } from "react";
import useGameActions from "../store/game/actions";
import PokerText from "../components/Text";
import { Image } from "react-native";

import Constants from "expo-constants";

import JustPokerLogo from "../assets/branding/just-poker.png";
import colors from "../styles/colors";
import { H1, YStack } from "tamagui";
import Head from "expo-router/head";
import GameSaver from "../store/saves";

export default function App() {
  const router = useRouter();
  const actions = useGameActions();

  const handleInitGame = () => {
    // console.log("init game");

    // expo router push
    router.push("/pregame");
    // actions.handleAdvanceGameRound();
  };

  const handleLoadGame = async () => {
    await GameSaver.loadGame().then(() => {
      // actions.handleAdvanceGameRound();
      router.push("/game");
    });
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  const gameStored = useMemo(
    () => !!localStorage.getItem("game"),
    [localStorage.getItem("game")]
  );

  const headerHeight = 60;

  return (
    <>
      <Head>
        <title>JustPoker</title>
      </Head>
      <YStack
        bg={"$backgroundStrong"}
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
        <H1 fontWeight={"bold"} mt="$4">
          Just Poker
        </H1>
        <PokerText
          fontWeight="light"
          style={{ fontSize: 18, marginBottom: 30, marginTop: 0 }}
        >
          by curi studios
        </PokerText>
        {gameStored && (
          <Button
            onPress={handleLoadGame}
            icon="play"
            style={{ marginBottom: 10, width: 200 }}
          >
            Continue Game
          </Button>
        )}
        <Button
          onPress={handleInitGame}
          icon="play"
          style={{ marginBottom: 10, width: 200 }}
        >
          Play
        </Button>
        <Button
          onPress={handleSettings}
          bg="$gray10"
          icon="settings"
          style={{ marginBottom: 10, width: 200 }}
        >
          Settings
        </Button>
        <PokerText fontWeight="light" style={{ fontSize: 12, marginTop: 0 }}>
          v{Constants.manifest.version}
        </PokerText>
      </YStack>
    </>
  );
}
