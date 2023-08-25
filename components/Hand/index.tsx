import React, { useCallback, useMemo } from "react";
import Card from "../Card";
import styled from "styled-components/native";
import { Text, View } from "react-native";
import { Player } from "../../store/players/types";
import HandInformation from "./HandInformation";
import useGameStore from "../../store/game/store";
import { isMobileScreen } from "../../styles/constants";
import { XStack } from "tamagui";

type Positions =
  | "right"
  | "left"
  | "top"
  | "topRight"
  | "topLeft"
  | "bottomLeft"
  | "bottomRight"
  | "bottom";

type Props = {
  position: Positions;
  player: Player;
  hidden?: boolean;
};

export default function Hand({
  positionIndex = 0,
  player,
  hidden = false,
}: Props) {
  const { result, cpuQuantity } = useGameStore();

  const getPositionNameByIndexAndPlayersLength = () => {
    if (cpuQuantity === 1) {
      if (positionIndex === 0) return "bottom";
      if (positionIndex === 1) return "top";
    }
    if (cpuQuantity === 2) {
      if (positionIndex === 0) return "bottom";
      if (positionIndex === 1) return "right";
      if (positionIndex === 2) return "left";
    }
    if (cpuQuantity === 3) {
      if (positionIndex === 0) return "bottom";
      if (positionIndex === 1) return "right";
      if (positionIndex === 2) return "top";
      if (positionIndex === 3) return "left";
    }
    if (cpuQuantity === 4) {
      if (positionIndex === 0) return "bottom";
      if (positionIndex === 1) return "right";
      if (positionIndex === 2) return "topRight";
      if (positionIndex === 3) return "topLeft";
      if (positionIndex === 4) return "left";
    }
    if (cpuQuantity === 5) {
      if (positionIndex === 0) return "bottom";
      if (positionIndex === 1) return "right";
      if (positionIndex === 2) return "topRight";
      if (positionIndex === 3) return "top";
      if (positionIndex === 4) return "topLeft";
      if (positionIndex === 5) return "left";
    }
    if (cpuQuantity === 6) {
      if (positionIndex === 0) return "bottom";
      if (positionIndex === 1) return "right";
      if (positionIndex === 2) return "topRight";
      if (positionIndex === 3) return "top";
      if (positionIndex === 4) return "topLeft";
      if (positionIndex === 5) return "left";
      if (positionIndex === 6) return "bottomLeft";
    }

    if (cpuQuantity === 7) {
      if (positionIndex === 0) return "bottomRight";
      if (positionIndex === 1) return "right";
      if (positionIndex === 2) return "topRight";
      if (positionIndex === 3) return "top";
      if (positionIndex === 4) return "topLeft";
      if (positionIndex === 5) return "left";
      if (positionIndex === 6) return "bottomLeft";
      if (positionIndex === 7) return "bottom";
    }
  };

  const getStyleByPosition = useCallback(() => {
    const position = getPositionNameByIndexAndPlayersLength();

    console.log(position);

    const coordinates = {
      bottom: {
        bottom: 0,
        marginBottom: -20,
      },
      right: {
        right: "-12%",
        marginRight: isMobileScreen ? 40 : 0,
      },
      left: {
        left: "-10%",
        marginLeft: isMobileScreen ? 40 : 0,
      },
      top: {
        top: "-20%",
        marginTop: 0,
      },
      topRight: {
        top: "-20%",
        right: "20%",
      },
      topLeft: {
        top: "-20%",
        left: "20%",
      },
      bottomLeft: {
        bottom: 0,
        left: "-10%",
      },
      bottomRight: {
        bottom: 0,
        right: "-10%",
      },
    };

    return coordinates[position];
  }, [positionIndex]);

  const positionStyle = useMemo(() => {
    return getStyleByPosition();
  }, [positionIndex]);

  const rowOrColumn = useMemo(() => {
    const position = getPositionNameByIndexAndPlayersLength();
    const row = ["left"];
    const rowReverse = ["right"];
    const column = ["top", "topRight", "topLeft"];
    const columnReverse = ["bottom", "bottomLeft", "bottomRight"];

    if (row.includes(position)) return "row";
    if (rowReverse.includes(position)) return "row-reverse";
    if (column.includes(position)) return "column";
    if (columnReverse.includes(position)) return "column-reverse";
  }, [positionIndex]);

  return (
    <HandWrapper
      style={positionStyle}
      folded={player?.status === "FOLD"}
      rowOrColumn={rowOrColumn}
    >
      {player?.id !== "mainPlayer" ? (
        <HandInformation player={player} isTurn={player?.isTurn} />
      ) : null}
      <XStack gap="$2">
        {(!isMobileScreen || player?.id === "mainPlayer") &&
          player.hand?.map((card: Card) => (
            <Card
              card={card}
              key={card?.id}
              hidden={hidden && !result?.winner}
            />
          ))}
      </XStack>
    </HandWrapper>
  );
}

const HandWrapper = styled.View<{ folded?: boolean; rowOrColumn: string }>`
  flex-direction: ${({ rowOrColumn }) => rowOrColumn};
  justify-content: center;
  align-items: center;
  gap: 20%;
  position: absolute;
  min-height: 150px;

  opacity: ${(props) => (props.folded ? 0.5 : 1)};
`;
