import { View, Text, TouchableOpacity } from "react-native";
import React, { useMemo } from "react";
import styled from "styled-components/native";
import Button from "../../components/Button";
import useRounds from "../../store/rounds";
import { RAISE_AMOUNT } from "../../store/poker/constants";

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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              marginRight: 10,
              // fontFamily: "Ubuntu-Bold",
            }}
          >
            ${store.playerMoney}
          </Text>

          <BetButton onPress={() => handleBet(0)}>
            <Text
              style={{
                color: "#fff",
              }}
            >
              $0
            </Text>
          </BetButton>

          {RAISE_AMOUNT.map((bet: number) => (
            <BetButton onPress={() => handleBet(bet)} key={bet}>
              <Text
                style={{
                  color: "#fff",
                }}
              >
                ${bet}
              </Text>
            </BetButton>
          ))}
        </View>
      )}
    </Container>
  );
}

const Container = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;

  background-color: #f0f0f0;
  border-top: 1px solid #ccc;
  padding: 5px;

  gap: 10px;

  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const BetButton = styled.TouchableOpacity`
  background-color: #333;
  padding: 5px;
  border-radius: 10px;
  width: 50px;
  text-align: center;
  align-items: center;
  justify-content: center;
`;
