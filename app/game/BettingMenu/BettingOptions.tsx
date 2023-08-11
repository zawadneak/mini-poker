import React, { useMemo } from "react";
import { View } from "react-native";
import usePlayerStore from "../../../store/players/store";
import useGameStore from "../../../store/game/store";
import BetButton from "./BetButton";
import PokerText from "../../../components/Text";
import useGameActions from "../../../store/game/actions";
import { useRouter } from "expo-router";
import { RAISE_AMOUNT, SMALL_BLIND_BET } from "../../../store/poker/constants";

// import { Container } from './styles';

const BettingOptions: React.FC = () => {
  const router = useRouter();
  const { mainPlayer, setPlayer } = usePlayerStore();
  const { bettingOrder, pot, setPot, currentBet } = useGameStore();

  const { handleAdvanceGameRound, handlePlayerBet, handlePlayerFold } =
    useGameActions();

  const handleLeaveTable = () => {
    router.replace("/");
  };

  const showNewRoundButton = useMemo(
    () => !mainPlayer.isTurn && !mainPlayer.isSmallBlind && bettingOrder === -1,
    [mainPlayer.isTurn, mainPlayer.isSmallBlind, bettingOrder]
  );

  const isSmallBlind = mainPlayer.isSmallBlind;
  const isBigBlind = mainPlayer.isBigBlind;

  const isPlayerTurn = mainPlayer.isTurn;

  const handleFoldOnSmallBlind = () => {
    handlePlayerFold();
    setPlayer({
      ...mainPlayer,
      money: mainPlayer.money - SMALL_BLIND_BET,
    });
    setPot(pot + SMALL_BLIND_BET);
  };

  const showBettingOptions = useMemo(() => {
    if (isSmallBlind || isBigBlind) return mainPlayer.blindCompleted;

    return true;
  }, [isSmallBlind, isBigBlind, mainPlayer.blindCompleted]);

  return (
    <View style={{ flexDirection: "row", justifyContent: "center", gap: 5 }}>
      {isSmallBlind && !mainPlayer.blindCompleted && (
        <>
          <BetButton
            onPress={() => handlePlayerBet(2)}
            disabled={!isPlayerTurn}
          >
            <PokerText
              style={{
                color: "#fff",
              }}
            >
              Cover small blind
            </PokerText>
          </BetButton>
          <BetButton onPress={handleFoldOnSmallBlind} disabled={!isPlayerTurn}>
            <PokerText
              style={{
                color: "#fff",
              }}
            >
              Fold
            </PokerText>
          </BetButton>
        </>
      )}
      {isBigBlind && !mainPlayer.blindCompleted && (
        <>
          <BetButton
            onPress={() => handlePlayerBet(2)}
            disabled={!isPlayerTurn}
          >
            <PokerText
              style={{
                color: "#fff",
              }}
            >
              Cover big blind
            </PokerText>
          </BetButton>
        </>
      )}
      {showNewRoundButton ? (
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
        showBettingOptions && (
          <>
            <BetButton onPress={handlePlayerFold} disabled={!isPlayerTurn}>
              <PokerText
                style={{
                  color: "#fff",
                }}
              >
                Fold
              </PokerText>
            </BetButton>
            <BetButton
              onPress={() => handlePlayerBet(currentBet || 0)}
              disabled={!isPlayerTurn}
            >
              <PokerText
                style={{
                  color: "#fff",
                }}
              >
                ${currentBet || 0}
              </PokerText>
            </BetButton>

            {RAISE_AMOUNT.map((bet: number) => (
              <BetButton
                onPress={() => handlePlayerBet(bet)}
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
        )
      )}
    </View>
  );
};

export default BettingOptions;
