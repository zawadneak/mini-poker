import { View, Text } from "react-native";
import React, { useMemo } from "react";

import styled from "styled-components/native";
import { darken } from "polished";
import colors from "../styles/colors";

type Props = {
  card: Card;
  hidden?: boolean;
};

const baseColors = {
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
    () => baseColors[card?.suit] || "blue",
    [card?.suit, baseColors]
  );

  if (!card) return <View></View>;
  return (
    <CardWrapper hidden={hidden}>
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

const CardWrapper = styled.View<{
  hidden?: boolean;
}>`
  width: 50px;
  height: 80px;

  border-radius: 15%;

  align-items: center;
  justify-content: center;
  background-color: ${colors.secondary};
  border: 1px solid ${darken(0.15, "#1f4068")};

  opacity: ${({ hidden }) => (hidden ? 0.5 : 1)};
`;

const CardText = styled.Text<{ color: "red" | "black" }>`
  color: ${({ color }) => color};
  font-size: 16px;
  font-family: "Ubuntu";
`;
