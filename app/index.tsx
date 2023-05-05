import styled from "styled-components/native";
import Container from "../components/Container";
import Button from "../components/Button";

export default function App() {
  return (
    <Container justifyContent="center" alignItems="center">
      <Title>MiniPoker</Title>
      <Button linkTo="/game">Play</Button>
    </Container>
  );
}

const Title = styled.Text`
  font-weight: bold;
  font-size: 24px;
`;
