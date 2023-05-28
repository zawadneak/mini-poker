import { View, Text } from "react-native";
import React, { useMemo } from "react";

import styled from "styled-components/native";

type Props = {
  card: Card;
  hidden?: boolean;
};

const Card = ({ card, hidden = false }: Props) => {
  const getCardColor = (suit?: Suits | string) => {
    if (!suit) return "black";
    if (suit === "hearts" || suit === "diamonds") {
      return "red";
    }

    return "black";
  };

  const cardColor = useMemo(() => getCardColor(card?.suit), [card?.suit]);

  if (!card) return <View></View>;
  return (
    <CardWrapper>
      {hidden ? (
        <View />
      ) : (
        <>
          <CardText color={cardColor}>{card.rank}</CardText>
          <CardText color={cardColor}>{card.suit}</CardText>
        </>
      )}
    </CardWrapper>
  );
};

export default Card;

const CardWrapper = styled.View`
  width: 100px;
  height: 150px;

  border: 1px solid black;
  border-radius: 10px;

  align-items: center;
  justify-content: center;
`;

const CardText = styled.Text<{ color: "red" | "black" }>`
  color: ${({ color }) => color};
`;
