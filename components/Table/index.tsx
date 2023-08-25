import React from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import PokerText from "../Text";
import colors from "../../styles/colors";
import useGameStore from "../../store/game/store";
import Card from "../Card";
import usePlayerStore from "../../store/players/store";
import Hand from "../Hand";
import { isMobileScreen } from "../../styles/constants";

// import { Container } from './styles';

const Table: React.FC = () => {
  const { table, gameRound, currentBet } = useGameStore();
  const { cpus, mainPlayer } = usePlayerStore();

  const getTableCardsShowPerRound = (): number => {
    if (gameRound === 1) return 3;
    if (gameRound === 2) return 4;
    if (gameRound === 3) return 5;
    return 0;
  };

  return (
    <TableContainer>
      <TableObject>
        <TableCards>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              gap: 10,
              padding: 40,
              marginTop: isMobileScreen ? "100%" : 0,
              flexWrap: "wrap",
            }}
          >
            {table?.map((card: Card, i: number) => (
              <Card
                card={card}
                key={card?.id}
                hidden={!(i < getTableCardsShowPerRound())}
              />
            ))}
          </View>

          {Object.keys(cpus).map((cpu, i) => (
            <Hand
              positionIndex={i + 1}
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
  /* width: ${isMobileScreen ? "60%" : "70%"}; */
  height: 50vh;
  width: 120vh;

  border-radius: 300px;

  background-color: ${colors.dark};
`;

const CardWrapper = styled.View`
  width: 100%;

  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;

  flex: 1;
`;

const TableCards = styled(CardWrapper)`
  width: 100%;
  flex-wrap: wrap;
  flex: 1;
`;
