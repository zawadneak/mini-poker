import { View, Text } from "react-native";
import React, { useMemo } from "react";

type Props = {
  fontWeight?: "normal" | "bold" | "medium" | "light";
  style?: { style: React.CSSProperties };
  children: React.ReactNode;
};

const PokerText = ({ fontWeight = "normal", children, ...style }: Props) => {
  const font = useMemo(() => {
    const fonts = {
      normal: "Ubuntu-Regular",
      bold: "Ubuntu-Bold",
      medium: "Ubuntu-Medium",
      light: "Ubuntu-Light",
    };

    return fonts[fontWeight] || fonts.normal;
  }, [fontWeight]);

  return (
    <Text
      style={{
        fontFamily: font,
        ...style.style,
      }}
    >
      {children}
    </Text>
  );
};

export default PokerText;
