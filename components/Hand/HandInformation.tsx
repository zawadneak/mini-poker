import React, { useMemo } from "react";
import { Player } from "../../store/players/types";
import { Text, View } from "react-native";
import usePlayerStore from "../../store/players/store";
import PokerText from "../Text";
import Avatar from "../Avatar";
import styled from "styled-components/native";
import { BigBlindTag, SmallBlindTag } from "./Tags";

type Props = {
  position: "bottom" | "right" | "left" | "top";
  player: Player;
  isTurn: boolean;
};

export default function HandInformation({ position, player, isTurn }: Props) {
  const avatarUrl = useMemo(
    () =>
      "https://source.boringavatars.com/beam/120/Stefan?colors=264653,f4a261,e76f51",
    []
  );

  const playerName = useMemo(
    () => (player.id === "mainPlayer" ? "You" : player.name),
    [player.id, player.name]
  );

  return (
    <View
      style={{
        position: "absolute",
        bottom: position === "top" ? 180 : -100,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 5,
      }}
    >
      <View style={{ alignItems: "center" }}>
        <Avatar source={avatarUrl} />
        <PokerText
          fontWeight="medium"
          style={{
            fontSize: 18,
            marginTop: 5,
          }}
        >
          {playerName}
        </PokerText>
      </View>
      <PokerText style={{ textAlign: "center" }}>
        {(player.isTurn && "Current turn") ||
          player.status ||
          "Waiting for turn"}
      </PokerText>
      {player?.isBigBlind && <BigBlindTag />}
      {player?.isSmallBlind && <SmallBlindTag />}
    </View>
  );
}
