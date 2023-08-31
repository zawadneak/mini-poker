import styled from "styled-components/native";
import Container from "../components/Container";
import Button from "../components/Button";
import { useRouter } from "expo-router";
import useGame from "../store/game";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useMemo } from "react";
import useGameActions from "../store/game/actions";
import PokerText from "../components/Text";
import { Image } from "react-native";

import Constants from "expo-constants";

import JustPokerLogo from "../assets/branding/just-poker.png";
import colors from "../styles/colors";
import { H1, YStack } from "tamagui";
import Head from "expo-router/head";
import GameSaver from "../store/saves";
import { DeleteStoredGame } from "../components/Alerts/DeleteStoredGame";

export default function App() {
  const router = useRouter();
  const actions = useGameActions();

  const [deleteStoredGame, setDeleteStoredGame] = React.useState(false);

  const gameStored = useMemo(
    () => !!localStorage.getItem("game"),
    [localStorage.getItem("game")]
  );

  const handleInitGame = () => {
    if (gameStored) {
      setDeleteStoredGame(true);
      return;
    }
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

  const handleDeleteGameAndStartNew = () => {
    setDeleteStoredGame(false);
    GameSaver.deleteGame();

    router.push("/pregame");
  };

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
        {deleteStoredGame && (
          <DeleteStoredGame
            onConfirm={handleDeleteGameAndStartNew}
            onCancel={() => setDeleteStoredGame(false)}
          />
        )}
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
            icon="save"
            style={{ marginBottom: 10, width: 200 }}
            bg="$purple10"
          >
            Continue Game
          </Button>
        )}
        <Button
          onPress={handleInitGame}
          icon="play"
          style={{ marginBottom: 10, width: 200 }}
        >
          Quick Play
        </Button>
        <Button
          disabled
          icon="trophy"
          style={{ marginBottom: 10, width: 200 }}
          bg="$yellow10"
        >
          Tournament
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
