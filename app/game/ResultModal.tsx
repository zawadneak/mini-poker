import { View, Text } from "react-native";
import React from "react";
import Button from "../../components/Button";
import { Modal } from "react-native";
import useGame from "../../store/game";
import styled from "styled-components/native";

export default function ResultModal({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}) {
  const { store } = useGame();

  const { result } = store;

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <Modal visible={visible} transparent>
      <Background>
        <ModalView>
          <Text>Winner</Text>
          <Text>
            {result?.winner} | {result?.play}
          </Text>
          <Button onPress={handleClose}>Close</Button>
        </ModalView>
      </Background>
    </Modal>
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
