import { Image, StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import colors from "../styles/colors";

export default function Avatar({ source }: { source: string }) {
  const selectionColors = [
    colors.purple,
    "#F94144",
    "#F3722C",
    "#F8961E",
    "#F9844A",
    "#F9C74F",
    "#90BE6D",
    "#43AA8B",
    "#4D908E",
    "#577590",
    "#277DA1",
    "#1B435D",
  ];

  const backgroundColor = useMemo(
    () => selectionColors[Math.floor(Math.random() * selectionColors.length)],
    []
  );

  return (
    <Image
      source={{ uri: source }}
      style={{
        width: 60,
        height: 60,
        borderRadius: 100,
      }}
    />
  );
}
