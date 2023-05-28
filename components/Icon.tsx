import { MaterialCommunityIcons } from "@expo/vector-icons";

export type IconType = React.ComponentProps<
  typeof MaterialCommunityIcons
>["name"];

export default function Icon({
  name,
  size = 24,
  color = "black",
  style,
  ...rest
}: {
  name: IconType;
  size?: number;
  color?: string;
  style?: any;
  [key: string]: any;
}) {
  return (
    <MaterialCommunityIcons
      name={name}
      size={size}
      color={color}
      style={[{ textAlign: "center" }, style]}
      {...rest}
    />
  );
}
