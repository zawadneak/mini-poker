import { View, Text } from "react-native";
import React from "react";
import useGame from "../../store/game";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Container from "../../components/Container";

type Props = {};

const Game = (props: Props) => {
  const { store } = useGame();

  return (
    <Container alignItems="center">
      <Button linkTo="/" style={{ marginBottom: 10 }}>
        Back
      </Button>
      <View
        style={{
          flexWrap: "wrap",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          flexDirection: "row",
        }}
      >
        {store.shuffledDeck.map((card: Card) => (
          <Card card={card} />
        ))}
      </View>
    </Container>
  );
};

export default Game;
