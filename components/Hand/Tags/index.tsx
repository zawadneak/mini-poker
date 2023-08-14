import React from "react";
import { View } from "react-native";
import PokerText from "../../Text";
import styled from "styled-components/native";

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

const BigBlindWrapper = styled.View`
  background-color: #f4a261;
  padding: 5px 10px;
  border-radius: 20px;
  margin-left: 5px;
`;

const SmallBlindWrapper = styled(BigBlindWrapper)`
  background-color: #9a17e6;
`;

export { BigBlindTag, SmallBlindTag };
