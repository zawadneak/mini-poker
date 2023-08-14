import styled from "styled-components/native";
import colors from "../styles/colors";

const BetButton = styled.TouchableOpacity<{
  disabled?: boolean;
}>`
  background-color: ${colors.highlight};
  padding: 5px 20px;
  border-radius: 5px;
  text-align: center;
  align-items: center;
  justify-content: center;

  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

export default BetButton;
