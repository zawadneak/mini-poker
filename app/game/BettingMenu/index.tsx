import { View, Text } from "react-native";
import React, { useMemo } from "react";
import styled from "styled-components/native";
import { RAISE_AMOUNT } from "../../../store/poker/constants";
import useGameActions from "../../../store/game/actions";
import useGameStore from "../../../store/game/store";
import usePlayerStore from "../../../store/players/store";
import PokerModal from "../../../components/PokerModal";
import { useRouter } from "expo-router";
import PokerText from "../../../components/Text";
import BettingOptions from "./BettingOptions";
import BetButton from "./BetButton";

export default function BettingMenu() {
  const { currentBet } = useGameStore();
  const { handlePlayerFold, handlePlayerBet } = useGameActions();

  const { mainPlayer, cpus } = usePlayerStore();

  const isPlayerTurn = useMemo(() => mainPlayer.isTurn, [mainPlayer.isTurn]);

  const playerMoney = useMemo(() => mainPlayer.money, [mainPlayer.money]);
  const didCPURaise = useMemo(
    () => Object.values(cpus).some((c) => c.status === "RAISE"),
    [cpus]
  );

  const showMatchOrFoldModal = useMemo(
    () => isPlayerTurn && didCPURaise,
    [isPlayerTurn, currentBet, mainPlayer.bet]
  );

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
        <PokerText
          style={{
            fontSize: 20,
            marginRight: 10,
          }}
        >
          ${playerMoney}
        </PokerText>

        {mainPlayer.isBigBlind && <PokerText>Big Blind</PokerText>}
        {mainPlayer.isSmallBlind && <PokerText>Small Blind</PokerText>}

        <BettingOptions />
      </View>

      {showMatchOrFoldModal && (
        <PokerModal>
          <View
            style={{
              gap: 10,
            }}
          >
            <BetButton
              onPress={() => handlePlayerBet(currentBet - mainPlayer.bet)}
            >
              <PokerText style={{ color: "#fff" }}>
                Match ${currentBet - mainPlayer.bet}
              </PokerText>
            </BetButton>
            <BetButton onPress={handlePlayerFold}>
              <PokerText style={{ color: "#fff" }}>Fold</PokerText>
            </BetButton>
          </View>
        </PokerModal>
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
