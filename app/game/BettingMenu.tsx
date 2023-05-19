import { View, Text } from "react-native";
import React, { useMemo } from "react";
import styled from "styled-components/native";
import Button from "../../components/Button";
import useRounds from "../../store/rounds";

export default function BettingMenu() {
  const { actions, store } = useRounds();

  const { handlePlayerBet, handlePlayerFold, handlePlayerMatch } = actions;
  const { bettingRound, bettingOrder, currentBet } = store;

  const handleBet = (ammount: 0 | 5 | 10 | 50) => {
    handlePlayerBet(ammount);
  };

  const didCPURaise = useMemo(
    () => bettingRound > 0 && bettingOrder === 0 && currentBet > 0,
    [bettingOrder, bettingRound, currentBet]
  );

  return (
    <Container>
      {didCPURaise ? (
        <Button onPress={() => handlePlayerMatch()}>Match ${currentBet}</Button>
      ) : (
        <>
          <Button onPress={() => handleBet(0)}>Check</Button>
          <Button onPress={() => handleBet(5)}>Raise $5</Button>
          <Button onPress={() => handleBet(10)}>Raise $10</Button>
          <Button onPress={() => handleBet(50)}>Raise $50</Button>
        </>
      )}
    </Container>
  );
}

const Container = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;

  gap: 5px;
  margin: 5px;
`;
