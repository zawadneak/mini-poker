import React, { useState } from "react";

import { Checkbox, H1, H2, Label, Tooltip, XStack, YStack } from "tamagui";
import Icon from "../../components/Icon";
import Button from "../../components/Button";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Linking } from "react-native";
import useLocalStorage from "../../utils/localStorage";

// import { Container } from './styles';

const Settings: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const ls = useLocalStorage();

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

  return (
    <YStack
      bg={"$background"}
      flex={1}
      alignItems="center"
      justifyContent="center"
    >
      <H2>Settings</H2>
      <YStack>
        <Tooltip>
          <Tooltip.Trigger>
            <XStack alignItems="center" gap="$2">
              <Label mt="$2" mb="$2">
                Show player personality on table?
              </Label>
              <Icon name="help-circle" color="#ddd" size={18} />
            </XStack>

            <Checkbox
              size="$6"
              defaultChecked={!!ls.getItem("showBotProfile")}
              onCheckedChange={(c) => handleToggleShowBotProfile(c)}
            >
              <Checkbox.Indicator>
                <Icon name="checkmark" />
              </Checkbox.Indicator>
            </Checkbox>
          </Tooltip.Trigger>
        </Tooltip>

        <Label
          mt="$4"
          mb="$2"
          cur="pointer"
          style={{ textDecoration: "underline" }}
          onPress={() => {
            Linking.openURL("https://www.vecteezy.com/free-vector/avatar");
          }}
        >
          Character art by by Vecteezy
        </Label>

        <Button
          icon={"link"}
          bg="$gray8"
          mt="$3"
          onPress={() => Linking.openURL("https://curistudios.com/justpoker")}
        >
          About JustPoker
        </Button>

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

export default Settings;
