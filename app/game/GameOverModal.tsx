import { View, Text } from "react-native";
import React, { useMemo, useState } from "react";
import Button from "../../components/Button";
import { Modal } from "react-native";
import useGame from "../../store/game";
import styled from "styled-components/native";
import PokerText from "../../components/Text";
import { AlertDialog, Dialog } from "tamagui";
import usePlayerActions from "../../store/players/actions";
import usePlayerStore from "../../store/players/store";

export default function GameOverModal() {
  const { store, actions } = useGame();
  const { getPlayer } = usePlayerActions();

  const { result } = store;

  const handleClose = () => {
    actions.gameOverHandler();
  };

  const parsedTime = useMemo(() => {
    let minutes: string | number = Math.floor(store.gameTime / 60);
    let seconds: string | number = store.gameTime % 60;

    if (minutes < 10) minutes = `0${minutes}`;
    if (seconds < 10) seconds = `0${seconds}`;

    return `${minutes}:${seconds}`;
  }, [store.gameTime]);

  return (
    <AlertDialog open={store.gameOver} onOpenChange={() => handleClose()}>
      <AlertDialog.Portal>
        <AlertDialog.Content
          bordered
          elevate
          animation={[
            "quick",
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
        >
          <AlertDialog.Title>♦️ Game over</AlertDialog.Title>

          <AlertDialog.Description>
            This game has ended! The game time was {parsedTime}
          </AlertDialog.Description>

          {/* {result?.winner === "mainPlayer" && (
            <AlertDialog.Description>You won 🎖️</AlertDialog.Description>
          )}

          {result?.winner !== "mainPlayer" && (
            <AlertDialog.Description mb="$4" mt="$4" fontSize={24}>
              You lost 😔
            </AlertDialog.Description>
          )} */}

          <AlertDialog.Action asChild mt="$4">
            <Button theme="active">Close</Button>
          </AlertDialog.Action>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
}

const Background = styled.View`
  background-color: rgba(0, 0, 0, 0.3);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const ModalView = styled.View`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  height: 80%;
  margin: auto;

  align-items: center;
  justify-content: center;
`;
