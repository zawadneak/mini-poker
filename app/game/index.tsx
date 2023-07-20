import { View, Text, Modal } from "react-native";
import React from "react";
import useGame from "../../store/game";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Container from "../../components/Container";

import styled from "styled-components/native";
import { useRouter } from "expo-router";
import useRounds from "../../store/rounds";
import BettingMenu from "./BettingMenu";
import GameStatus from "./GameStatus";
import ResultModal from "./ResultModal";
import IconButton from "../../components/IconButton";
import CpuResponseModal from "./CpuResponseModal";
import Hand from "../../components/Hand";

type Props = {};

const Game = (props: Props) => {
  const router = useRouter();

  const { store, actions } = useGame();
  const { store: roundStore, actions: roundActions } = useRounds();

  const { gameRound, cpuResponse } = roundStore;
  const { resetRound, resetGameMoney } = roundActions;

  const { dealCards, startNewGameRound, resetGame } = actions;
  const { playerHand, dealerHand, table, result, gameStarted, shuffledDeck } =
    store;

  const [showWinner, setShowWinner] = React.useState(false);

  const getTableCardsShowPerRound = (): number => {
    if (gameRound === 1) return 3;
    if (gameRound === 2) return 4;
    if (gameRound === 3) return 5;
    return 0;
  };

  const handleNextGameRound = () => {
    if (!gameStarted) return handleStartGame();
  };

  const handleStartGame = () => {
    if (!shuffledDeck[0]) return router.replace("/");
    dealCards();
    resetRound();
  };

  React.useEffect(() => {
    if (!!result) {
      setShowWinner(true);
    }
  }, [result]);

  const handleCloseGame = () => {
    resetGame();
    resetGameMoney();
    router.push("/");
  };

  const handleEndGame = () => {
    startNewGameRound();
    setShowWinner(false);
  };

  return (
    <>
      <ResultModal visible={showWinner} onClose={handleEndGame} />
      {cpuResponse !== "WAITING" && <CpuResponseModal />}
      <Container alignItems="center" justifyContent="center">
        <IconButton
          size={20}
          icon="arrow-left"
          onPress={handleCloseGame}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 2,
          }}
        ></IconButton>

        <GameStatus />

        <Hand
          cards={dealerHand}
          position="top"
          money={roundStore.cpuMoney}
          hidden
        ></Hand>

        <Table>
          {table?.map(
            (card: Card, i: number) =>
              i < getTableCardsShowPerRound() && (
                <Card card={card} key={card?.id} />
              )
          )}
        </Table>

        <Hand
          position="bottom"
          cards={playerHand}
          money={roundStore.playerMoney}
        />

        {gameStarted && <BettingMenu handleNextRound={handleNextGameRound} />}

        {!gameStarted && (
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
            <Button onPress={handleNextGameRound}>Start Round</Button>
          </View>
        )}
      </Container>
    </>
  );
};

export default Game;

const CardWrapper = styled.View`
  width: 100%;

  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;

  flex: 1;
`;

const Table = styled(CardWrapper)`
  width: 100%;
  flex-wrap: wrap;
  flex: 1;
`;
