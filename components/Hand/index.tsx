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
      if (positionIndex === 0) return "bottomRight";
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
        bottom: "-10%",
      },
      right: {
        right: "-8%",
        marginRight: isMobileScreen ? 40 : 0,
      },
      left: {
        left: "-8%",
        marginLeft: isMobileScreen ? 40 : 0,
      },
      top: {
        top: "-10%",
        marginTop: 0,
      },
      topRight: {
        top: "-10%",
        right: "10%",
      },
      topLeft: {
        top: "-10%",
        left: "10%",
      },
      bottomLeft: {
        bottom: "-10%",
        left: "10%",
      },
      bottomRight: {
        bottom: "-10%",
        right: "10%",
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
      <HandInformation player={player} isTurn={player?.isTurn} />
    </HandWrapper>
  );
}

const HandWrapper = styled.View<{ folded?: boolean; rowOrColumn: string }>`
  flex-direction: ${({ rowOrColumn }) => rowOrColumn};
  justify-content: center;
  align-items: center;
  gap: 10px;
  position: absolute;
  min-height: 150px;

  opacity: ${(props) => (props.folded ? 0.5 : 1)};
`;
