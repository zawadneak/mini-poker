import React from "react";
import { View } from "react-native";
import PokerText from "../../components/Text";
import { XStack, YStack } from "tamagui";

// import { Container } from './styles';

const Settings: React.FC = () => {
  return (
    <YStack bg={"$background"} flex={1}>
      <PokerText>Settings</PokerText>
    </YStack>
  );
};

export default Settings;
