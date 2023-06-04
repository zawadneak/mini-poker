import React from "react";
import { Modal } from "react-native";
import PokerModal from "../../components/PokerModal";
import { View } from "react-native";
import { Text } from "react-native";
import useRounds from "../../store/rounds";
import Button from "../../components/Button";

type Props = {};

export default function CpuResponseModal({}: Props) {
  const { store, actions } = useRounds();

  const isFolding = store.cpuResponse === "FOLD";

  return (
    <PokerModal>
      <View>
        <Text>{store.cpuResponse}</Text>

        {!isFolding && (
          <Button onPress={actions.handlePlayerMatch}>
            <Text>Match</Text>
          </Button>
        )}
        <Button onPress={actions.handlePlayerFold}>
          <Text>{isFolding ? "Next match" : "Fold"}</Text>
        </Button>
      </View>
    </PokerModal>
  );
}
