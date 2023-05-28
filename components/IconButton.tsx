import { TouchableOpacity } from "react-native";
import Icon, { IconType } from "./Icon";
import styled from "styled-components/native";
import { Link } from "expo-router";

export default function IconButton({
  icon,
  size,
  linkTo,
  ...props
}: {
  icon: IconType;
  size: number;
  linkTo?: string;
  backgroundColor?: string;
  color?: string;
  [key: string]: any;
}) {
  const content = (
    <StyledTO {...props}>
      <Icon name={icon} size={size} color={props.color || "white"} />
    </StyledTO>
  );

  if (linkTo) return <Link href={linkTo}>{content}</Link>;

  return content;
}

const StyledTO = styled.TouchableOpacity<{
  backgroundColor?: string;
  color?: string;
}>`
  padding: 5px;
  border-radius: 5px;
  background-color: ${({ backgroundColor }) => backgroundColor || "#555"};
  color: ${({ color }) => color || "white"};
  align-items: center;
  justify-content: center;
`;
