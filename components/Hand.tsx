import React from "react";
import Card from "./Card";
import styled from "styled-components/native";
import { Text, View } from "react-native";

type Props = {
  position: "bottom" | "right" | "left" | "top";
  cards: Card[];
  money: number;
  hidden?: boolean;
};

export default function Hand({
  position = "top",
  cards,
  money,
  hidden = false,
}: Props) {
  const getStyleByPosition = (
    position: "bottom" | "right" | "left" | "top"
  ) => {
    const coordinates = {
      bottom: {
        bottom: 0,
        marginBottom: -100,
        left: 0,
        right: 0,
      },
      right: {
        top: 0,
        bottom: 0,
        right: 0,
        marginRight: -150,
      },
      left: {
        top: 0,
        bottom: 0,
        left: 0,
        marginLeft: -150,
      },
      top: {
        top: 0,
        marginTop: -150,
        left: 0,
        right: 0,
      },
    };

    return coordinates[position];
  };

  return (
    <HandWrapper style={getStyleByPosition(position)}>
      {hidden && (
        <View
          style={{
            position: "absolute",
            bottom: 80,
          }}
        >
          CPU ${money}
        </View>
      )}
      {cards?.map((card: Card) => (
        <Card card={card} key={card?.id} hidden={hidden} />
      ))}
    </HandWrapper>
  );
}

const HandWrapper = styled.View`
  width: 100%;
  position: relative;

  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;

  flex: 1;
`;
