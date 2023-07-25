import React from "react";
import { Modal } from "react-native";
import PokerModal from "../../components/PokerModal";
import { View } from "react-native";
import { Text } from "react-native";
import useRounds from "../../store/rounds";
import Button from "../../components/Button";
import useGame from "../../store/game";

type Props = {};

export default function CpuResponseModal({}: Props) {
  const { store, actions } = useGame();

  const isFolding = false;

  return (
    <PokerModal>
      {/* <View
        style={{
          gap: 10,
          textAlign: "center",
        }}
      >
        <Text>CPU RESPONSE:</Text>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {store.cpuResponse}
        </Text>
        {store.cpuResponse === "RAISE" && (
          <Text
            style={{
              fontSize: 20,
              // fontFamily: "Ubuntu-Bold",
            }}
          >
            ${store.currentBet}
          </Text>
        )}

        {!isFolding && store.cpuResponse !== "MATCH" ? (
          <Button onPress={actions.handlePlayerMatch}>
            <Text>Match</Text>
          </Button>
        ) : (
          <Button onPress={actions.handlePlayerContinue}>
            <Text>Continue</Text>
          </Button>
        )}
        <Button onPress={actions.handlePlayerFold}>
          <Text>{isFolding ? "Next match" : "Fold"}</Text>
        </Button>
      </View> */}
    </PokerModal>
  );
}
