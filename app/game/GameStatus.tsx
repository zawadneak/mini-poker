import { View, Text } from "react-native";
import React from "react";
import styled from "styled-components/native";
import useRounds from "../../store/rounds";

export default function GameStatus() {
  const { store } = useRounds();

  const { pot, currentBet, gameRound, bettingRound, playerMoney, cpuMoney } =
    store;
  return (
    <Container>
      <Text>Round: {gameRound}</Text>
      <Text>Betting Round: {bettingRound}</Text>
      <Text>Pot: ${pot}</Text>
      <Text>Money: ${playerMoney}</Text>
      <Text>CPU Money: ${cpuMoney}</Text>
    </Container>
  );
}
const Container = styled.View`
  position: absolute;
  top: 0;
  right: 0;

  gap: 5px;
  margin: 5px;
`;
