import React from "react";
import Card from "../Card";
import styled from "styled-components/native";
import { Text, View } from "react-native";
import { Player } from "../../store/players/types";
import HandInformation from "./HandInformation";
import useGameStore from "../../store/game/store";

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
        marginBottom: 0,
      },
      right: {
        right: 0,
        // backgroundColor: "red",s
        transform: [{ rotate: "-90deg" }],
        marginRight: -50,
      },
      left: {
        left: 0,
        marginLeft: -50,
        transform: [{ rotate: "90deg" }],
        // backgroundColor: "yellow",
      },
      top: {
        top: 0,
        marginTop: -30,
      },
    };

    return coordinates[position];
  };

  return (
    <HandWrapper
      style={getStyleByPosition(position)}
      folded={player?.status === "FOLD"}
    >
      {player.id !== "mainPlayer" && (
        <HandInformation
          player={player}
          position={position}
          isTurn={player?.isTurn}
        />
      )}
      {player.hand?.map((card: Card) => (
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
