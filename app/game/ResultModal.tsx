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

export default function ResultModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { store, actions } = useGame();
  const { getPlayer } = usePlayerActions();

  const [seeTable, setSeeTable] = useState(false);

  const { result } = store;

  const handleClose = () => {
    actions.handleEndGameRound();
    onClose();
  };

  const player = useMemo(() => getPlayer(result?.winner), [result?.winner]);

  return (
    <AlertDialog open={visible} onOpenChange={() => handleClose()}>
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
          y="55%"
        >
          <AlertDialog.Title>{player?.name} won!</AlertDialog.Title>

          <AlertDialog.Description>{result?.play}</AlertDialog.Description>

          <AlertDialog.Action asChild mt="$2">
            <Button theme="active">End round</Button>
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
