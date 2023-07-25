import { View, Text } from "react-native";
import React from "react";
import styled from "styled-components/native";
import useRounds from "../../store/rounds";

export default function GameStatus() {
  const { store } = useRounds();

  const { pot, gameRound } = store;
  return (
    <Container>
      <View>
        <Text
          style={
            {
              // sfontFamily: "Ubuntu",
            }
          }
        >
          Round: {gameRound}
        </Text>
        <Text
          style={
            {
              // fontFamily: "Ubuntu",
            }
          }
        >
          Pot: ${pot}
        </Text>
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
