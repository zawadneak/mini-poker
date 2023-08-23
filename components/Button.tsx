import React from "react";
import styled from "styled-components/native";
import { Link } from "expo-router";
import Icon, { IconType } from "./Icon";
import PokerText from "./Text";
import colors from "../styles/colors";
import { ButtonProps, Button as TamaguiButton, Text } from "tamagui";

type Props = {
  icon?: IconType;
  color?: string;
  linkTo?: string;
  disabled?: boolean;
} & ButtonProps;

const Button = ({
  color = "white",
  linkTo,
  icon,
  disabled,
  bg,
  ...props
}: Props) => {
  const content = (
    <TamaguiButton
      bg={"$red10" || bg || colors.highlight}
      color={color}
      disabled={disabled}
      opacity={disabled ? 0.3 : 1}
      icon={icon && <Icon name={icon} size={24} color={color} />}
      {...props}
    >
      <Text
        fontWeight="bold"
        style={{
          color: color || "white",
          //  fontFamily: "Ubuntu-Bold"
        }}
      >
        {props.children}
      </Text>
    </TamaguiButton>
  );

  if (linkTo) {
    return <Link href={linkTo}>{content}</Link>;
  }

  return content;
};

export default Button;
