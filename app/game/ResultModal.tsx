import { View, Text } from "react-native";
import React, { useState } from "react";
import Button from "../../components/Button";
import { Modal } from "react-native";
import useGame from "../../store/game";
import styled from "styled-components/native";

export default function ResultModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { store } = useGame();

  const [seeTable, setSeeTable] = useState(false);

  const { result } = store;

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal visible={visible} transparent>
      {seeTable ? (
        <Button onPress={handleClose}>End round</Button>
      ) : (
        <Background>
          <ModalView>
            <Text>Winner</Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 32,
                margin: 10,
              }}
            >
              {result?.winner} | {result?.play}
            </Text>
            <Button onPress={handleClose}>End round</Button>

            <Button onPress={() => setSeeTable(true)}>See table</Button>
          </ModalView>
        </Background>
      )}
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
