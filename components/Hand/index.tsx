import React from "react";
import Card from "../Card";
import styled from "styled-components/native";
import { Text, View } from "react-native";
import { Player } from "../../store/players/types";
import HandInformation from "./HandInformation";
import useGameStore from "../../store/game/store";
import { isMobileScreen } from "../../styles/constants";

type Props = {
  position: "bottom" | "right" | "left" | "top";
  player: Player;
  hidden?: boolean;
};

export default function Hand({
  position = "top",
  player,
  hidden = false,
}: Props) {
  const { result } = useGameStore();

  const getStyleByPosition = (
    position: "bottom" | "right" | "left" | "top"
  ) => {
    const coordinates = {
      bottom: {
        bottom: 0,
        marginBottom: -80,
      },
      right: {
        right: 0,
        // backgroundColor: "red",s
        transform: [{ rotate: "-90deg" }],
        marginRight: isMobileScreen ? 40 : 0,
      },
      left: {
        left: 0,
        marginLeft: isMobileScreen ? 40 : 0,
        transform: [{ rotate: "90deg" }],
      },
      top: {
        top: isMobileScreen ? 60 : 20,
        marginTop: 0,
      },
    };

    return coordinates[position];
  };

  return (
    <HandWrapper
      style={getStyleByPosition(position)}
      folded={player?.status === "FOLD"}
    >
      <HandInformation
        player={player}
        position={position}
        isTurn={player?.isTurn}
      />
      {(!isMobileScreen || player?.id === "mainPlayer") &&
        player.hand?.map((card: Card) => (
          <Card card={card} key={card?.id} hidden={hidden && !result?.winner} />
        ))}
    </HandWrapper>
  );
}

const HandWrapper = styled.View<{ folded?: boolean }>`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
  position: absolute;
  min-height: 150px;

  opacity: ${(props) => (props.folded ? 0.5 : 1)};
`;
