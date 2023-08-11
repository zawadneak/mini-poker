import React from "react";
import { Player } from "../../store/players/types";
import { Text, View } from "react-native";
import usePlayerStore from "../../store/players/store";
import PokerText from "../Text";

type Props = {
  position: "bottom" | "right" | "left" | "top";
  player: Player;
  isTurn: boolean;
};

export default function HandInformation({ position, player, isTurn }: Props) {
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
      <PokerText
        style={{
          fontSize: 21,
          fontWeight: isTurn ? "bold" : "normal",
        }}
      >
        {player.name} ${player.money}
      </PokerText>
      <PokerText> Bet ${player.bet}</PokerText>
      <PokerText style={{ textAlign: "center" }}>
        {(player.isTurn && "Current turn") ||
          player.status ||
          "Waiting for turn"}
      </PokerText>
      {player?.isBigBlind && <PokerText>Big Blind</PokerText>}
      {player?.isSmallBlind && <PokerText>Small Blind</PokerText>}
    </View>
  );
}
