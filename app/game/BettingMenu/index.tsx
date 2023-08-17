import { View, Text } from "react-native";
import React, { useMemo } from "react";
import styled from "styled-components/native";
import {
  BIG_BLIND_BET,
  RAISE_AMOUNT,
  SMALL_BLIND_BET,
} from "../../../store/poker/constants";
import useGameActions from "../../../store/game/actions";
import useGameStore from "../../../store/game/store";
import usePlayerStore from "../../../store/players/store";
import PokerModal from "../../../components/PokerModal";
import { useRouter } from "expo-router";
import PokerText from "../../../components/Text";
import BettingOptions from "../../../components/BettingOptions";
import BetButton from "../../../components/BetButton";
import { lighten } from "polished";
import colors from "../../../styles/colors";
import { BigBlindTag, SmallBlindTag } from "../../../components/Hand/Tags";
import Avatar from "../../../components/Avatar";
import Button from "../../../components/Button";
import IconButton from "../../../components/IconButton";

export default function BettingMenu() {
  const { currentBet, pot } = useGameStore();
  const [playerBet, setPlayerBet] = React.useState(0);
  const { handlePlayerFold, handlePlayerBet } = useGameActions();

  const { mainPlayer, cpus } = usePlayerStore();

  const isPlayerTurn = useMemo(() => mainPlayer.isTurn, [mainPlayer.isTurn]);
  const isSmallBlind = useMemo(
    () => mainPlayer.isSmallBlind,
    [mainPlayer.isSmallBlind]
  );

  const isBigBlind = useMemo(
    () => mainPlayer.isBigBlind,
    [mainPlayer.isBigBlind]
  );

  const playerMoney = useMemo(() => mainPlayer.money, [mainPlayer.money]);
  const didCPURaise = useMemo(
    () => Object.values(cpus).some((c) => c.status === "RAISE"),
    [cpus]
  );

  const needsToMatch = useMemo(
    () => isPlayerTurn && didCPURaise,
    [isPlayerTurn, currentBet, mainPlayer.bet]
  );

  const buttonsDisabled =
    !isPlayerTurn ||
    ((isSmallBlind || isBigBlind) && !mainPlayer?.blindCompleted);

  // React.useEffect
  // (()=>{
  //   if
  // },[
  //   gameRound,currentBet
  // ])

  const handlePredefinedBet = (key: "1/4" | "1/2" | "full" | "all") => {
    const options = {
      "1/4": Math.floor(pot / 4),
      "1/2": Math.floor(pot / 2),
      full: pot,
      all: playerMoney,
    };

    let bet = options[key] || 0;

    if (bet > playerMoney) {
      bet = playerMoney;
    }

    setPlayerBet(bet);
  };

  React.useEffect(() => {
    console.log("oi");
    if ((isSmallBlind || isBigBlind) && !mainPlayer?.blindCompleted) {
      console.log("oi", BIG_BLIND_BET);
      setPlayerBet(BIG_BLIND_BET);
    }
  }, [isSmallBlind, isBigBlind]);

  React.useEffect(() => {
    if (needsToMatch) {
      setPlayerBet(currentBet);
    }
  }, [needsToMatch]);

  React.useEffect(() => {
    if (!isPlayerTurn) {
      setPlayerBet(0);
    }
  }, [isPlayerTurn]);

  return (
    <Container>
      <View
        style={{
          gap: 5,
          flexDirection: "row",
          justifyContent: "flex-start",
          flex: 1,
        }}
      >
        <Button
          backgroundColor={colors.dark}
          disabled={buttonsDisabled}
          onPress={() => handlePredefinedBet("1/4")}
        >
          1/4 pot
        </Button>
        <Button
          backgroundColor={colors.dark}
          disabled={buttonsDisabled}
          onPress={() => handlePredefinedBet("1/2")}
        >
          1/2 pot
        </Button>
        <Button
          backgroundColor={colors.dark}
          disabled={buttonsDisabled}
          onPress={() => handlePredefinedBet("full")}
        >
          full pot
        </Button>
        <Button
          icon="cash"
          backgroundColor={colors.purple}
          disabled={buttonsDisabled}
          onPress={() => handlePredefinedBet("all")}
        >
          all in
        </Button>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <View style={{ flexDirection: "row", flex: 1 }}>
          <IconButton
            icon="remove"
            size={36}
            backgroundColor={colors.primary}
            onPress={() => setPlayerBet((pb) => (pb <= 0 ? 0 : pb - 1))}
            disabled={
              (needsToMatch && playerBet === currentBet) || buttonsDisabled
            }
          />
          <PokerText fontWeight="bold" style={{ fontSize: 40 }}>
            ${playerBet}
          </PokerText>

          <IconButton
            icon="add"
            size={36}
            backgroundColor={colors.primary}
            onPress={() =>
              setPlayerBet((pb) => (pb >= playerMoney ? playerMoney : pb + 1))
            }
            disabled={buttonsDisabled}
          />
        </View>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
          justifyContent: "flex-end",
        }}
      >
        <Button
          icon="close"
          backgroundColor={colors.dark}
          disabled={buttonsDisabled}
          onPress={handlePlayerFold}
        >
          Fold
        </Button>
        <Button
          icon="arrow-forward"
          onPress={() => handlePlayerBet(playerBet)}
          disabled={!isPlayerTurn}
        >
          {needsToMatch ? "Match" : playerBet === 0 ? "Check" : "Bet"}
        </Button>
      </View>
    </Container>
  );
}

const Container = styled.View`
  position: absolute;
  z-index: 2;
  bottom: 0;
  left: 0;

  background-color: transparent;
  border-top: 1px solid #ccc;
  padding: 5px;

  gap: 10px;

  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
  padding: 20px;
  padding-bottom: 40px;
`;
