import styled from "styled-components/native";

const BetButton = styled.TouchableOpacity<{
  disabled?: boolean;
}>`
  background-color: #333;
  padding: 5px;
  border-radius: 10px;
  width: 50px;
  text-align: center;
  align-items: center;
  justify-content: center;

  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

export default BetButton