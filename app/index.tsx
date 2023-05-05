import styled from "styled-components/native";
import Container from "../components/Container";
import Button from "../components/Button";
import { useRouter } from "expo-router";
import useGame from "../store/game";

export default function App() {
  const router = useRouter();
  const { actions } = useGame();

  const handleInitGame = () => {
    console.log("init game");

    actions.shuffleDeck();

    // expo router push
    router.push("/game");
  };

  return (
    <Container justifyContent="center" alignItems="center">
      <Title>MiniPoker</Title>
      <Button onPress={handleInitGame}>Play</Button>
    </Container>
  );
}

const Title = styled.Text`
  font-weight: bold;
  font-size: 24px;
`;
