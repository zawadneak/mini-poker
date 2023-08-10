import { View, Text } from "react-native";
import React from "react";
import styled from "styled-components/native";
import useGame from "../../store/game";
import PokerText from "../../components/Text";

export default function GameStatus() {
  const { store } = useGame();

  const { pot, gameRound, currentBet } = store;
  return (
    <Container>
      <View>
        <PokerText>Round: {gameRound}</PokerText>
        <PokerText>Betting Order: {store.bettingOrder}</PokerText>
        <PokerText>Pot: ${pot}</PokerText>
        <PokerText>CB: ${currentBet}</PokerText>
      </View>
    </Container>
  );
}
const Container = styled.View`
  position: absolute;
  top: 0;
  right: 0;

  gap: 5px;

  background-color: #f0f0f0;

  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 10px;
  border-bottom-left-radius: 10px;
`;
