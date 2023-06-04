import { View, Text, Modal } from "react-native";
import React from "react";
import styled from "styled-components/native";

export default function PokerModal({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Modal visible transparent>
      <Background>
        <ModalView>{children}</ModalView>
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
