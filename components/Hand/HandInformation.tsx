import React, { useMemo } from "react";
import { Player } from "../../store/players/types";
import { Text, View } from "react-native";
import usePlayerStore from "../../store/players/store";
import PokerText from "../Text";
import Avatar from "../Avatar";
import styled from "styled-components/native";
import {
  BigBlindTag,
  DoneStatusTag,
  PlayerStatusTag,
  PlayingStatusTag,
  SmallBlindTag,
  WaitingStatusTag,
} from "./Tags";
import colors from "../../styles/colors";
import { lighten } from "polished";
import useGameStore from "../../store/game/store";
import { isMobileScreen } from "../../styles/constants";

type Props = {
  position: "bottom" | "right" | "left" | "top";
  player: Player;
  isTurn: boolean;
};

export default function HandInformation({ position, player, isTurn }: Props) {
  const { roundOrderSequence } = useGameStore();

  const avatarUrl = useMemo(() => "https://robohash.org/" + player.name, []);

  const playerName = useMemo(
    () => (player.id === "mainPlayer" ? "You" : player.name),
    [player.id, player.name]
  );

  const playerRoundIndex = useMemo(
    () => roundOrderSequence.findIndex((id) => id === player.id),
    [roundOrderSequence, player.id]
  );

  return (
    <View
      style={{
        position: "absolute",
        bottom: position === "top" ? 150 : isMobileScreen ? -40 : -100,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 10,
      }}
    >
      <View style={{ alignItems: "center", justifyContent: "center", gap: 10 }}>
        <PlayerStatusTag {...player} />

        {player?.isBigBlind && <BigBlindTag />}
        {player?.isSmallBlind && <SmallBlindTag />}
      </View>
      <View style={{ alignItems: "center" }}>
        <Avatar source={avatarUrl} />
        <View
          style={{
            flexDirection: "row",
            gap: 5,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PokerText
            fontWeight="light"
            style={{
              fontSize: 12,
              marginTop: 5,
            }}
          >
            {playerRoundIndex + 1}
          </PokerText>
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
        <MoneyHolder>
          <PokerText
            fontWeight="bold"
            style={{
              fontSize: 14,
              marginTop: 5,
            }}
          >
            ${player.money}
          </PokerText>
        </MoneyHolder>
      </View>

      {/* <PokerText>{player?.status}</PokerText> */}
    </View>
  );
}

export const MoneyHolder = styled.View`
  background-color: ${lighten(0.05, colors.primary)};
  padding: 5px 10px;
  border-radius: 5px;
`;
