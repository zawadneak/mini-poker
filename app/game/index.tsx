import { View, Text, Modal } from "react-native";
import React, { useMemo } from "react";
import useGame from "../../store/game";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Container from "../../components/Container";

import styled from "styled-components/native";
import { useRouter } from "expo-router";
import BettingMenu from "./BettingMenu";
import GameStatus from "./GameStatus";
import ResultModal from "./ResultModal";
import IconButton from "../../components/IconButton";
import Hand from "../../components/Hand";
import usePlayers from "../../store/players";
import useGameActions from "../../store/game/actions";
import useGameStore, { gameStore } from "../../store/game/store";
import Table from "./Table";
import GameOverModal from "./GameOverModal";
import Head from "expo-router/head";

type Props = {};

const Game = (props: Props) => {
  const router = useRouter();
  const { store: playerStore, actions: playerActions } = usePlayers();

  const { resetGame, resetGameMoney, handleAdvanceGameRound } =
    useGameActions();
  const { table, result, gameStarted, shuffledDeck, gameRound } = gameStore(
    (state) => state
  );

  const { mainPlayer, cpus } = playerStore;

  const [showWinner, setShowWinner] = React.useState(false);

  const isPlayerTurn = useMemo(() => mainPlayer?.isTurn, [mainPlayer?.isTurn]);

  React.useEffect(() => {
    if (!!result?.winner) {
      setShowWinner(true);
    }
  }, [result]);

  const handleCloseGame = () => {
    resetGame();
    resetGameMoney();
    router.push("/");
  };

  const handleEndGame = () => {
    setShowWinner(false);
  };

  if (!gameStarted) {
    return (
      <>
        <GameOverModal />
        <Container alignItems="center" justifyContent="center">
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,

              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button onPress={handleAdvanceGameRound}>Start Round</Button>
          </View>
        </Container>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>JustPoker</title>
      </Head>
      <ResultModal visible={showWinner} onClose={handleEndGame} />
      <Container alignItems="center" justifyContent="center">
        <GameStatus />

        {gameStarted && <BettingMenu />}

        <Table />
      </Container>
    </>
  );
};

export default Game;
