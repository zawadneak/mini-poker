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

type Props = {};

const Game = (props: Props) => {
  const router = useRouter();
  const { store: playerStore, actions: playerActions } = usePlayers();

  const {
    startNewGameRound,
    resetGame,
    resetGameMoney,
    handleAdvanceGameRound,
  } = useGameActions();
  const { table, result, gameStarted, shuffledDeck, gameRound } = gameStore(
    (state) => state
  );

  const { mainPlayer, cpus } = playerStore;

  const [showWinner, setShowWinner] = React.useState(false);

  const getTableCardsShowPerRound = (): number => {
    if (gameRound === 1) return 3;
    if (gameRound === 2) return 4;
    if (gameRound === 3) return 5;
    return 0;
  };

  const isPlayerTurn = useMemo(() => mainPlayer?.isTurn, [mainPlayer?.isTurn]);

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

  const positions = ["right", "top", "left"];

  if (!gameStarted) {
    return (
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
    );
  }

  return (
    <>
      <ResultModal visible={showWinner} onClose={handleEndGame} />
      <Container alignItems="center" justifyContent="center">
        <IconButton
          size={20}
          icon="arrow-left"
          onPress={handleCloseGame}
          style={{
            position: "absolute",
            top: 50,
            left: 0,
            zIndex: 2,
          }}
        ></IconButton>

        <GameStatus />

        {Object.keys(cpus).map((cpu, i) => (
          <Hand
            position={positions[i]}
            player={cpus[cpu]}
            key={cpus[cpu].id}
            hidden={true}
          ></Hand>
        ))}

        <Table>
          {table?.map(
            (card: Card, i: number) =>
              i < getTableCardsShowPerRound() && (
                <Card card={card} key={card?.id} />
              )
          )}
        </Table>

        <Hand position="bottom" player={mainPlayer} />

        {gameStarted && <BettingMenu />}
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
