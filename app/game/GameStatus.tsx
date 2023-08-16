import { View, Text, Image } from "react-native";
import React, { useMemo } from "react";
import styled from "styled-components/native";
import useGame from "../../store/game";
import PokerText from "../../components/Text";
import colors from "../../styles/colors";
import { lighten } from "polished";
import IconButton from "../../components/IconButton";
import { useRouter } from "expo-router";

import JustPokerLogo from "../../assets/branding/just-poker.png";
import { isMobileScreen } from "../../styles/constants";
import { H3 } from "tamagui";

export default function GameStatus() {
  const route = useRouter();
  const { store } = useGame();

  const [time, setTime] = React.useState(0);
  const { pot, gameRound, currentBet } = store;

  const roundString = useMemo(() => {
    const rounds = {
      0: "preflop",
      1: "flop",
      2: "turn",
      3: "river",
    };

    return rounds[gameRound] || "Error";
  }, [gameRound]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime((time) => time + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const parsedTime = useMemo(() => {
    let minutes: string | number = Math.floor(time / 60);
    let seconds: string | number = time % 60;

    if (minutes < 10) minutes = `0${minutes}`;
    if (seconds < 10) seconds = `0${seconds}`;

    return `${minutes}:${seconds}`;
  }, [time]);

  return (
    <Container>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!isMobileScreen && (
          <Image
            source={JustPokerLogo}
            style={{
              height: 50,
              width: 50,
              borderRadius: 10,
              marginLeft: 20,
              marginRight: -10,
              marginBottom: 10,
            }}
          />
        )}
        <View
          style={{
            flexDirection: isMobileScreen ? "row" : "column",
            width: isMobileScreen ? "100%" : "auto",
          }}
        >
          <StyledInfoBar>
            <H3>round</H3>

            <PokerText fontWeight="bold" style={{ fontSize: 21 }}>
              {roundString}
            </PokerText>
          </StyledInfoBar>

          <StyledInfoBar>
            <PokerText>bet</PokerText>

            <PokerText fontWeight="bold" style={{ fontSize: 21 }}>
              ${currentBet}
            </PokerText>
          </StyledInfoBar>

          <StyledInfoBar>
            <PokerText>pot</PokerText>

            <PokerText
              fontWeight="bold"
              style={{ fontSize: 21, color: colors.highlight }}
            >
              ${pot}
            </PokerText>
          </StyledInfoBar>
        </View>
      </View>

      <View
        style={{
          flexDirection: isMobileScreen ? "row-reverse" : "column",
          alignItems: "center",
          justifyContent: "center",
          width: isMobileScreen ? "100%" : "auto",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 10,
            gap: 10,
          }}
        >
          <IconButton
            icon="settings"
            size={24}
            onPress={() => route.replace("/")}
            style={{
              width: 40,
            }}
          />
          <IconButton
            icon="exit"
            size={24}
            onPress={() => route.replace("/")}
            style={{
              width: 40,
            }}
          />
        </View>

        <StyledInfoBar>
          <PokerText>time</PokerText>

          <PokerText fontWeight="bold" style={{ fontSize: 21 }}>
            {parsedTime}
          </PokerText>
        </StyledInfoBar>
      </View>
    </Container>
  );
}
const Container = styled.View`
  position: absolute;
  top: 20px;

  width: 100%;

  z-index: 2;
  flex-direction: ${isMobileScreen ? "column" : "row"};

  align-items: flex-start;
  justify-content: ${isMobileScreen ? "space-between" : "space-between"};
`;

const StyledInfoBar = styled.View`
  background-color: ${colors.dark};

  flex-direction: row;
  gap: ${isMobileScreen ? "5px" : "20px"};
  padding: 5px 10px;

  align-items: baseline;
  justify-content: space-between;

  border-radius: 5px;
  margin-bottom: 5px;
  margin-left: 20px;
  margin-right: 20px;
`;
