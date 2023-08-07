import { View, Text } from "react-native";
import React, { useMemo } from "react";
import styled from "styled-components/native";
import { RAISE_AMOUNT } from "../../store/poker/constants";
import useGameActions from "../../store/game/actions";
import useGameStore from "../../store/game/store";
import usePlayerStore from "../../store/players/store";
import PokerModal from "../../components/PokerModal";
import { useRouter } from "expo-router";
import PokerText from "../../components/Text";

export default function BettingMenu() {
  const router = useRouter();
  const { setPot, pot, bettingOrder, currentBet, setCurrentBet, gameRound } =
    useGameStore();
  const { handleAdvanceGameRound, handlePlayerRaise, handlePlayerFold } =
    useGameActions();

  const { setPlayer, mainPlayer, cpus } = usePlayerStore();

  const isPlayerTurn = useMemo(() => mainPlayer.isTurn, [mainPlayer.isTurn]);

  const handleBet = (ammount: number) => {
    console.log(ammount, mainPlayer.money - ammount);
    setPlayer({
      ...mainPlayer,
      isTurn: false,
      bet: ammount,
      money: mainPlayer.money - ammount,
    });

    setPot(pot + ammount);
    setCurrentBet(ammount);
    if (!mainPlayer.isSmallBlind && ammount > pot) {
      handlePlayerRaise();
    }

    handleAdvanceGameRound();
  };

  const playerMoney = useMemo(() => mainPlayer.money, [mainPlayer.money]);
  const didCPURaise = useMemo(
    () => Object.values(cpus).some((c) => c.status === "RAISE"),
    [cpus]
  );

  const showMatchOrFoldModal = useMemo(
    () => isPlayerTurn && didCPURaise,
    [isPlayerTurn, currentBet, mainPlayer.bet]
  );

  const handleLeaveTable = () => {
    router.replace("/");
  };

  console.log(currentBet, mainPlayer.bet);

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

        {!mainPlayer.isTurn &&
        !mainPlayer.isSmallBlind &&
        bettingOrder === -1 ? (
          <>
            <BetButton onPress={handleAdvanceGameRound}>
              <PokerText
                style={{
                  color: "#fff",
                }}
              >
                Start new round
              </PokerText>
            </BetButton>
            <BetButton onPress={handleLeaveTable}>
              <PokerText
                style={{
                  color: "#fff",
                }}
              >
                Leave table
              </PokerText>
            </BetButton>
          </>
        ) : (
          <>
            <BetButton onPress={() => handleBet(0)} disabled={!isPlayerTurn}>
              <PokerText
                style={{
                  color: "#fff",
                }}
              >
                $0
              </PokerText>
            </BetButton>

            {RAISE_AMOUNT.map((bet: number) => (
              <BetButton
                onPress={() => handleBet(bet)}
                key={bet}
                disabled={!isPlayerTurn}
              >
                <PokerText
                  style={{
                    color: "#fff",
                  }}
                >
                  ${bet}
                </PokerText>
              </BetButton>
            ))}
          </>
        )}
      </View>

      {showMatchOrFoldModal && (
        <PokerModal>
          <View
            style={{
              gap: 10,
            }}
          >
            <BetButton onPress={() => handleBet(currentBet - mainPlayer.bet)}>
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

const BetButton = styled.TouchableOpacity<{
  disabled?: boolean;
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
