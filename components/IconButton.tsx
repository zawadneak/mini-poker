import { TouchableOpacity } from "react-native";
import Icon, { IconType } from "./Icon";
import styled from "styled-components/native";
import { Link } from "expo-router";
import colors from "../styles/colors";
import { Button } from "tamagui";

export default function IconButton({
  icon,
  size,
  linkTo,
  disabled,
  backgroundColor,
  ...props
}: {
  icon: IconType;
  size: number;
  linkTo?: string;
  backgroundColor?: string;
  color?: string;
  disabled?: boolean;
  [key: string]: any;
}) {
  const content = (
    <Button
      disabled={disabled}
      opacity={disabled ? 0.3 : 1}
      bg={backgroundColor || "$red10"}
      {...props}
    >
      <Icon name={icon} size={size} color={props.color || "white"} />
    </Button>
  );

  if (linkTo) return <Link href={linkTo}>{content}</Link>;

  return content;
}

// const StyledTO = styled.TouchableOpacity<{
//   backgroundColor?: string;
//   color?: string;
//   disabled?: boolean;
// }>`
//   padding: 5px;
//   border-radius: 5px;
//   background-color: ${({ backgroundColor }) =>
//     backgroundColor || colors.highlight};
//   color: ${({ color }) => color || "white"};
//   align-items: center;
//   justify-content: center;
//   opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
// `;
