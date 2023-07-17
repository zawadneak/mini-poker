import { View, Text } from "react-native";
import React from "react";
import styled from "styled-components/native";

type Props = {
  children: React.ReactNode;
  justifyContent?: string;
  alignItems?: string;
} & React.ComponentProps<typeof View>;

const Container = ({
  children,
  justifyContent,
  alignItems,
  ...props
}: Props) => {
  return (
    <ContainerView
      justifyContent={justifyContent}
      alignItems={alignItems}
      {...props}
    >
      {children}
    </ContainerView>
  );
};

export default Container;

const ContainerView = styled.View<{
  justifyContent?: string;
  alignItems?: string;
}>`
  flex-direction: column;
  justify-content: ${({ justifyContent }) =>
    justifyContent ? justifyContent : "flex-start"};

  align-items: ${({ alignItems }) => (alignItems ? alignItems : "flex-start")};

  height: 100%;
  width: 100%;
  overflow: hidden;
`;
