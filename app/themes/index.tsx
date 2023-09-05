import React, { useState } from "react";

import {
  Checkbox,
  H1,
  H2,
  H5,
  Label,
  Paragraph,
  Tooltip,
  View,
  XStack,
  YStack,
  useTheme,
} from "tamagui";
import Icon from "../../components/Icon";
import Button from "../../components/Button";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Linking } from "react-native";
import useLocalStorage from "../../utils/localStorage";
import styled from "styled-components/native";

// import { Container } from './styles';

const themes = [
  {
    name: "Dark",
    description: "The default curi theme",
    premium: false,
    mainColor: "$background",
    secondaryColor: "#333",
  },
  // {
  //   name: "Light",
  //   description: "A light theme",
  //   premium: false,
  //   mainColor: "#fff",
  //   secondaryColor: "#aaa",
  // },
];

const Themes: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const ls = useLocalStorage();
  const currentTheme = useTheme();

  const [showBotProfile, setShowBotProfile] = useState<boolean>(
    !!ls.getItem("showBotProfile")
  );

  const handleToggleShowBotProfile = (v: boolean) => {
    setShowBotProfile(!v);
    if (v) {
      ls.setItem("showBotProfile", "true");
    } else {
      ls.removeItem("showBotProfile");
    }
  };

  const handleToggleTheme = (t: string) => {
    // set tamagui theme
    // set local storage theme
    theme;
  };

  const selected = "Dark";

  return (
    <YStack
      bg={"$background"}
      flex={1}
      alignItems="center"
      justifyContent="center"
    >
      <H2 mb="$2">Themes</H2>
      <YStack gap="$2">
        {themes?.map((theme) => (
          <XStack
            width="full"
            bg={theme.name === selected ? "$gray8" : "$backgroundFocus"}
            padding="$3"
            borderRadius="$2"
            cur="pointer"
            justifyContent="space-between"
            gap="$4"
            hoverStyle={{ opacity: 0.8 }}
          >
            <YStack>
              <H5>{theme.name}</H5>
              <Paragraph>{theme.description}</Paragraph>
            </YStack>

            <XStack gap="$2">
              <View
                bg={theme.mainColor}
                style={{ height: 50, width: 50, borderRadius: "100%" }}
              ></View>
              <View
                bg={theme.secondaryColor}
                style={{ height: 50, width: 50, borderRadius: "100%" }}
              ></View>
            </XStack>
          </XStack>
        ))}
        <Button
          icon={"arrow-back"}
          bg="$gray8"
          mt="$3"
          onPress={() => router.replace(`/${params.returnUrl || ""}`)}
        >
          Back
        </Button>
      </YStack>
    </YStack>
  );
};

export default Themes;
