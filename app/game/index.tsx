import { View, Text, Modal } from "react-native";
import React from "react";
import useGame from "../../store/game";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Container from "../../components/Container";

import styled from "styled-components/native";
import { useRouter } from "expo-router";

type Props = {};

const Game = (props: Props) => {
  const router = useRouter();

  const { store, actions } = useGame();

  const { dealCards, getWinner, shuffleDeck } = actions;
  const { playerHand, dealerHand, table, result, gameStarted, shuffledDeck } =
    store;

  const [showWinner, setShowWinner] = React.useState(false);

  const handleStartGame = () => {
    if (!shuffledDeck[0]) return router.replace("/");
    dealCards();
  };

  const handleShowWinner = () => {
    getWinner();
    setShowWinner(true);
  };

  return (
    <>
      <Modal visible={showWinner}>
        <View>
          <Text>Winner</Text>
          <Text>
            {result?.winner} | {result?.play}
          </Text>
          <Button onPress={() => setShowWinner(false)}>Close</Button>
        </View>
      </Modal>
      <Container alignItems="center">
        <Button linkTo="/" style={{ marginBottom: 10 }}>
          Back
        </Button>
        <Button
          onPress={gameStarted ? handleShowWinner : handleStartGame}
          style={{ marginBottom: 10 }}
        >
          {gameStarted ? "Show Winner" : "Start Game"}
        </Button>

        <DealerHand>
          {dealerHand?.map((card: Card) => (
            <Card card={card} key={card?.id} />
          ))}
        </DealerHand>

        <Table>
          {table?.map((card: Card) => (
            <Card card={card} key={card?.id} />
          ))}
        </Table>

        <PlayerHand>
          {playerHand?.map((card: Card) => (
            <Card card={card} key={card?.id} />
          ))}
        </PlayerHand>
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
