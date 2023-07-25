import React from "react";
import { Player } from "../../store/players/types";
import { Text, View } from "react-native";

type Props = {
  position: "bottom" | "right" | "left" | "top";
  player: Player;
};

export default function HandInformation({ position, player }: Props) {
  console.log(player);
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
      <Text>
        {player.status ||
          (player.isTurn && "Current turn") ||
          "Waiting for turn"}
      </Text>
      {player?.isBigBlind && <Text>Big Blind</Text>}
      {player?.isSmallBlind && <Text>Small Blind</Text>}
    </View>
  );
}
