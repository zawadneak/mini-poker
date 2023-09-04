import React, { useMemo } from "react";
import { Checkbox, H2, Label, Slider, Tooltip, XStack, YStack } from "tamagui";
import Button from "../../components/Button";
import { useRouter } from "expo-router";
import Icon from "../../components/Icon";
import useGameActions from "../../store/game/actions";
import useGameStore from "../../store/game/store";
import { parseMoneyQuantity } from "../../utils/parseMoney";

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
    startingBlind,
    setStartingBlind,
  } = useGameStore();

  const handleStartGame = () => {
    handleAdvanceGameRound();
    router.push("/game");
  };

  const parsedStartingMoney = useMemo(
    () => parseMoneyQuantity(startingMoney),
    [startingMoney]
  );

  const parsedBlind = useMemo(
    () => parseMoneyQuantity(startingMoney),
    [startingMoney]
  );

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
          max={7}
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

        <Label>Starting money ${parsedStartingMoney}</Label>

        {/* max => 1m */}
        <Slider
          size="$2"
          width={200}
          defaultValue={[startingMoney || 1000]}
          max={1000000}
          min={1000}
          step={1000}
          onValueChange={(v) => {
            setStartingMoney(v[0]);
          }}
        >
          <Slider.Track>
            <Slider.TrackActive />
          </Slider.Track>
          <Slider.Thumb circular index={0} />
        </Slider>

        <Label>Blind ${startingBlind}</Label>

        <Slider
          size="$2"
          width={200}
          defaultValue={[startingBlind || 50]}
          max={1000}
          min={50}
          step={50}
          onValueChange={(v) => {
            setStartingBlind(v[0]);
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
      </YStack>

      <Button icon={"play"} mt="$4" onPress={handleStartGame}>
        Start
      </Button>
    </YStack>
  );
}
