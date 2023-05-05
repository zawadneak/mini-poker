import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import styled from "styled-components/native";

export default function App() {
  return (
    <View>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />

      <View>
        <Title>Teste</Title>
      </View>
    </View>
  );
}

const Title = styled.Text`
  font-weight: bold;
  margin-top: 200px;
`;
