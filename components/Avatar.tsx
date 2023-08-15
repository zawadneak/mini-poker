import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";

export default function Avatar({ source }: { source: string }) {
  return (
    <Image
      source={{ uri: source }}
      style={{
        width: 50,
        height: 50,
        borderRadius: 25,
      }}
    />
  );
}
