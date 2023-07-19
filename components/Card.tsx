import { View, Text } from "react-native";
import React, { useMemo } from "react";

import styled from "styled-components/native";

type Props = {
  card: Card;
  hidden?: boolean;
};

const colors = {
  hearts: "red",
  diamonds: "red",
  spades: "black",
  clubs: "black",
};

const cardIcon = {
  hearts: "♥",
  diamonds: "♦",
  spades: "♠",
  clubs: "♣",
};

const Card = ({ card, hidden = false }: Props) => {
  const cardColor = useMemo(
    () => colors[card?.suit] || "blue",
    [card?.suit, colors]
  );

  if (!card) return <View></View>;
  return (
    <CardWrapper>
      {hidden ? (
        <View />
      ) : (
        <View
          style={{
            flexDirection: "row",
            gap: 10,
          }}
        >
          <CardText color={cardColor}>
            {cardIcon[card.suit] || "Error"}
          </CardText>
          <CardText color={cardColor}>{card.rank}</CardText>
        </View>
      )}
    </CardWrapper>
  );
};

export default Card;

const CardWrapper = styled.View`
  width: 20%;
  height: 30%;
  max-width: 100px;

  border: 1px solid black;
  border-radius: 10px;

  align-items: center;
  justify-content: center;
`;

const CardText = styled.Text<{ color: "red" | "black" }>`
  color: ${({ color }) => color};
  font-size: 21px;
  font-family: "Ubuntu";
`;
