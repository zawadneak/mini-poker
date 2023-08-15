import React from "react";
import { View } from "react-native";
import PokerText from "../../Text";
import styled from "styled-components/native";
import Icon from "../../Icon";
import colors from "../../../styles/colors";
import { Player } from "../../../store/players/types";

// import { Container } from './styles';

const BigBlindTag: React.FC = () => {
  return (
    <BigBlindWrapper>
      <PokerText fontWeight="bold">B</PokerText>
    </BigBlindWrapper>
  );
};

const SmallBlindTag: React.FC = () => {
  return (
    <SmallBlindWrapper>
      <PokerText fontWeight="bold">S</PokerText>
    </SmallBlindWrapper>
  );
};

const WaitingStatusTag: React.FC = () => {
  return (
    <StatusTag background={"#30d0db"}>
      <Icon name="hourglass" color="#fff" />
    </StatusTag>
  );
};

const PlayingStatusTag: React.FC = () => {
  return (
    <StatusTag background={"#f4a261"}>
      <Icon name="hand-right" color="#fff" />
    </StatusTag>
  );
};

const DoneStatusTag: React.FC = () => {
  return (
    <StatusTag background={"#27c434"}>
      <Icon name="checkmark-done" color="#fff" />
    </StatusTag>
  );
};

const FoldStatusTag: React.FC = () => {
  return (
    <StatusTag background={colors.dark}>
      <Icon name="close" color="#fff" />
    </StatusTag>
  );
};

const RaiseStatusTag: React.FC = () => {
  return (
    <StatusTag background={colors.highlight}>
      <Icon name="trending-up" color="#fff" />
    </StatusTag>
  );
};

const PlayerStatusTag: React.FC = ({
  isTurn,
  hasBetted,
  status,
}: {
  isTurn: boolean;
  hasBetted: boolean;
  status: Player["status"];
}) => {
  if (status === "RAISE") return <RaiseStatusTag />;
  if (status === "FOLD") return <FoldStatusTag />;
  if (isTurn) return <PlayingStatusTag />;
  if (hasBetted) return <DoneStatusTag />;
  return <WaitingStatusTag />;
};

const BigBlindWrapper = styled.View`
  background-color: #f4a261;
  padding: 5px 10px;
  border-radius: 20px;
  margin-left: 5px;
`;

const SmallBlindWrapper = styled(BigBlindWrapper)`
  background-color: #9a17e6;
`;

const StatusTag = styled.View<{ background: string }>`
  padding: 5px 10px;
  border-radius: 20px;
  margin-left: 5px;
  align-items: center;
  justify-content: center;

  background-color: ${(props) => props.background || "#f4a261"};
`;

export { BigBlindTag, SmallBlindTag, PlayerStatusTag };
