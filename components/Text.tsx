import React, { useMemo } from "react";
import { Text } from "tamagui";

type Props = {
  fontWeight?: "normal" | "bold" | "medium" | "light";
  style?: { style: React.CSSProperties };
  children: React.ReactNode;
};

const PokerText = ({ fontWeight = "normal", children, ...style }: Props) => {
  return (
    <Text
      fontWeight={fontWeight}
      fontFamily={"$body"}
      style={{
        color: "#f0f0f0",
        ...style.style,
      }}
    >
      {children}
    </Text>
  );
};

export default PokerText;
