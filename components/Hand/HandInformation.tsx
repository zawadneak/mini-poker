import React from "react";
import { Player } from "../../store/players/types";
import { Text, View } from "react-native";
import usePlayerStore from "../../store/players/store";

type Props = {
  position: "bottom" | "right" | "left" | "top";
  player: Player;
};

export default function HandInformation({ position, player }: Props) {
  return (
    <View
      style={{
        position: "absolute",
        bottom: position === "top" ? -50 : 120,
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
      }}
    >
      <Text style={{ fontSize: 21 }}>
        {player.name} ${player.money}
      </Text>
      <Text> Bet ${player.bet}</Text>
      <Text>
        {(player.isTurn && "Current turn") ||
          player.status ||
          "Waiting for turn"}
      </Text>
      {player?.isBigBlind && <Text>Big Blind</Text>}
      {player?.isSmallBlind && <Text>Small Blind</Text>}
    </View>
  );
}
