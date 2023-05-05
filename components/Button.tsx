import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import styled from "styled-components/native";
import { Link } from "expo-router";

type Props = {
  backgroundColor?: string;
  color?: string;
  linkTo?: string;
} & TouchableOpacity["props"];

const Button = ({ backgroundColor, color, linkTo, ...props }: Props) => {
  const content = (
    <ButtonWrapper backgroundColor={backgroundColor} {...props}>
      <Text style={{ color: color || "white", fontWeight: "bold" }}>
        {props.children}
      </Text>
    </ButtonWrapper>
  );

  if (linkTo) {
    return <Link href={linkTo}>{content}</Link>;
  }

  return content;
};

export default Button;

const ButtonWrapper = styled.TouchableOpacity<{ backgroundColor?: string }>`
  background-color: ${({ backgroundColor }) => backgroundColor || "#000"};
  padding: 10px 40px;
  border-radius: 5px;
  color: #fff;
`;
