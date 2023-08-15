import { Dimensions } from "react-native";

const isMobileScreen = Dimensions.get("window").width < 768;

export { isMobileScreen };
