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

type Props = {};

const Game = (props: Props) => {
  const router = useRouter();

  const { store, actions } = useGame();
  const { store: roundStore, actions: roundActions } = useRounds();

  const { gameRound } = roundStore;
  const { nextGameRound, resetRound } = roundActions;

  const { dealCards, getWinner, shuffleDeck, resetGame } = actions;
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

  const handleShowWinner = () => {
    getWinner();
    setShowWinner(true);
  };

  React.useEffect(() => {
    if (!!result) {
      setShowWinner(true);
    }
  }, [result]);

  const handleEndGame = () => {
    resetGame();
    setShowWinner(false);
    router.replace("/");
  };

  return (
    <>
      <ResultModal visible={showWinner} onClose={handleEndGame} />
      <Container alignItems="center">
        <Button onPress={() => router.push("/")} style={{ marginBottom: 10 }}>
          Back
        </Button>

        <GameStatus />

        <DealerHand>
          {dealerHand?.map((card: Card) => (
            <Card card={card} key={card?.id} />
          ))}
        </DealerHand>

        <Table>
          {table?.map(
            (card: Card, i: number) =>
              i < getTableCardsShowPerRound() && (
                <Card card={card} key={card?.id} />
              )
          )}
        </Table>

        <PlayerHand>
          {playerHand?.map((card: Card) => (
            <Card card={card} key={card?.id} />
          ))}
        </PlayerHand>

        <BettingMenu handleNextRound={handleNextGameRound} />

        {!gameStarted && (
          <Button
            style={{
              position: "absolute",
              bottom: 10,
              right: 10,
            }}
            onPress={handleNextGameRound}
          >
            {gameStarted ? "Next Round" : "Start Game"}
          </Button>
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

  position: absolute;
`;

const PlayerHand = styled(CardWrapper)`
  bottom: 10px;
`;

const DealerHand = styled(CardWrapper)`
  top: 120px;

  /* transform: rotate(180deg); */
`;

const Table = styled(CardWrapper)`
  top: 40%;
  width: 100%;
  flex-wrap: wrap;
`;
