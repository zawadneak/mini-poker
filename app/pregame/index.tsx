import React from "react";
import { Checkbox, H2, Label, Slider, Tooltip, XStack, YStack } from "tamagui";
import Button from "../../components/Button";
import { useRouter } from "expo-router";
import Icon from "../../components/Icon";
import useGameActions from "../../store/game/actions";
import useGameStore from "../../store/game/store";

type Props = {};

export default function PreGame({}: Props) {
  const router = useRouter();
  const { handleAdvanceGameRound } = useGameActions();
  const {
    cpuQuantity,
    startingMoney,
    differentProfiles,
    setShowBotProfile,
    setCpuQuantity,
    setDifferentProfiles,
    setStartingMoney,
  } = useGameStore();

  const handleStartGame = () => {
    handleAdvanceGameRound();
    router.push("/game");
  };

  return (
    <YStack
      flex={1}
      bg={"$background"}
      alignItems="center"
      justifyContent="center"
      gap="$4"
    >
      <H2>Play Match</H2>

      <YStack gap="$4">
        <Label>How many players? {cpuQuantity + 1}</Label>

        <Slider
          size="$2"
          width={200}
          defaultValue={[3]}
          max={8}
          min={1}
          step={1}
          onValueChange={(v) => {
            setCpuQuantity(v[0]);
          }}
        >
          <Slider.Track>
            <Slider.TrackActive />
          </Slider.Track>
          <Slider.Thumb circular index={0} />
        </Slider>

        <Label>Starting money ${startingMoney}</Label>

        <Slider
          size="$2"
          width={200}
          defaultValue={[100]}
          max={1000}
          min={50}
          step={50}
          onValueChange={(v) => {
            setStartingMoney(v[0]);
          }}
        >
          <Slider.Track>
            <Slider.TrackActive />
          </Slider.Track>
          <Slider.Thumb circular index={0} />
        </Slider>

        <Tooltip>
          <Tooltip.Trigger>
            <XStack alignItems="center" gap="$2">
              <Label mt="$2" mb="$2">
                Different bot profiles?
              </Label>
              <Icon name="help-circle" color="#ddd" size={18} />
            </XStack>

            <Checkbox
              size="$6"
              onCheckedChange={(c) => setDifferentProfiles(c)}
            >
              <Checkbox.Indicator>
                <Icon name="checkmark" />
              </Checkbox.Indicator>
            </Checkbox>
          </Tooltip.Trigger>

          <Tooltip.Content>
            <Label>
              Uses a mix of agressive and conservative styles of play for the
              bots
            </Label>
          </Tooltip.Content>
        </Tooltip>

        <Tooltip>
          <Tooltip.Trigger>
            <XStack alignItems="center" gap="$2">
              <Label mt="$2" mb="$2">
                Show bot profiles on table?
              </Label>
              <Icon name="help-circle" color="#ddd" size={18} />
            </XStack>

            <Checkbox size="$6" onCheckedChange={(c) => setShowBotProfile(c)}>
              <Checkbox.Indicator>
                <Icon name="checkmark" />
              </Checkbox.Indicator>
            </Checkbox>
          </Tooltip.Trigger>
        </Tooltip>
      </YStack>

      <Button icon={"play"} mt="$4" onPress={handleStartGame}>
        Start
      </Button>
    </YStack>
  );
}
