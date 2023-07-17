import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import styled from "styled-components/native";
import { Link } from "expo-router";
import Icon, { IconType } from "./Icon";

type Props = {
  icon?: IconType;
  backgroundColor?: string;
  color?: string;
  linkTo?: string;
} & TouchableOpacity["props"];

const Button = ({
  backgroundColor,
  color = "white",
  linkTo,
  icon,
  ...props
}: Props) => {
  const content = (
    <ButtonWrapper backgroundColor={backgroundColor} color={color} {...props}>
      {icon && <Icon name={icon} size={24} color={color} />}
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

const ButtonWrapper = styled.TouchableOpacity<{
  backgroundColor?: string;
  color?: string;
}>`
  background-color: ${({ backgroundColor }) => backgroundColor || "#555"};
  padding: 10px 30px;
  border-radius: 5px;
  color: ${({ color }) => color || "white"};
  width: auto;

  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-direction: row;

  font-size: 16px;
`;
