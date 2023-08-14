import React from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import PokerText from "../../../components/Text";
import colors from "../../../styles/colors";
import useGameStore from "../../../store/game/store";
import Card from "../../../components/Card";
import usePlayerStore from "../../../store/players/store";
import Hand from "../../../components/Hand";

// import { Container } from './styles';

const Table: React.FC = () => {
  const { table, gameRound } = useGameStore();
  const { cpus, mainPlayer } = usePlayerStore();

  const getTableCardsShowPerRound = (): number => {
    if (gameRound === 1) return 3;
    if (gameRound === 2) return 4;
    if (gameRound === 3) return 5;
    return 0;
  };

  const positions = ["right", "top", "left"];

  return (
    <TableContainer>
      <TableObject>
        <TableCards>
          {table?.map((card: Card, i: number) => (
            <Card
              card={card}
              key={card?.id}
              hidden={!(i < getTableCardsShowPerRound())}
            />
          ))}

          {Object.keys(cpus).map((cpu, i) => (
            <Hand
              position={positions[i]}
              player={cpus[cpu]}
              key={cpus[cpu].id}
              hidden={true}
            ></Hand>
          ))}

          <Hand position="bottom" player={mainPlayer} />
        </TableCards>
      </TableObject>
    </TableContainer>
  );
};

export default Table;

const TableContainer = styled.View`
  height: 100%;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const TableObject = styled.View`
  width: 70%;
  height: 60%;
  margin-bottom: 5%;

  border-radius: 300px;

  background-color: ${colors.dark};
`;

const CardWrapper = styled.View`
  width: 100%;

  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.5%;

  flex: 1;
`;

const TableCards = styled(CardWrapper)`
  width: 100%;
  flex-wrap: wrap;
  flex: 1;
`;
