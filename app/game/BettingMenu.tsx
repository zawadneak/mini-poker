import { View, Text, TouchableOpacity } from "react-native";
import React, { useMemo } from "react";
import styled from "styled-components/native";
import Button from "../../components/Button";
import useRounds from "../../store/rounds";
import { RAISE_AMOUNT } from "../../store/poker/constants";
import useGame from "../../store/game";
import useGameActions from "../../store/game/actions";
import useGameStore from "../../store/game/store";
import usePlayerStore from "../../store/players/store";

export default function BettingMenu() {
  const { setPot, pot, bettingOrder, currentBet } = useGameStore();
  const { handleAdvanceGameRound } = useGameActions();

  const { setPlayer, mainPlayer } = usePlayerStore();

  const isPlayerTurn = mainPlayer.isTurn;

  const handleBet = (ammount: 0 | 5 | 10 | 50) => {
    setPlayer({
      ...mainPlayer,
      isTurn: false,
      bet: ammount,
      money: mainPlayer.money - ammount,
    });

    setPot(pot + ammount);
    // console.log({
    //   ...mainPlayer,
    //   isTurn: false,
    //   bet: ammount,
    //   money: mainPlayer.money - ammount,
    // });

    handleAdvanceGameRound();
  };

  const playerMoney = useMemo(() => mainPlayer.money, [mainPlayer.money]);
  const didCPURaise = useMemo(() => false, []);

  return (
    <Container>
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
          ${playerMoney}
        </Text>

        {mainPlayer.isBigBlind && <Text>Big Blind</Text>}
        {mainPlayer.isSmallBlind && <Text>Small Blind</Text>}

        <BetButton onPress={() => handleBet(0)} disabled={!isPlayerTurn}>
          <Text
            style={{
              color: "#fff",
            }}
          >
            $0
          </Text>
        </BetButton>

        {RAISE_AMOUNT.map((bet: number) => (
          <BetButton
            onPress={() => handleBet(bet)}
            key={bet}
            disabled={!isPlayerTurn}
          >
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

const BetButton = styled.TouchableOpacity<{
  disabled: boolean;
}>`
  background-color: #333;
  padding: 5px;
  border-radius: 10px;
  width: 50px;
  text-align: center;
  align-items: center;
  justify-content: center;

  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;
