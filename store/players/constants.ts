import { STARTING_MONEY } from "../poker/constants";

const CPU_COUNT = 3;

const NAMES = ["John", "Jane", "Bob", "Sally", "Joe", "Mary", "Bill"];

const BASE_PLAYER_OBJECT = {
  name: "",
  hand: [],
  money: STARTING_MONEY,
  bet: 0,
  status: null,
  isTurn: false,
  isWinner: false,
  isBigBlind: false,
  isSmallBlind: false,
  hasBetted: false,
};

export { BASE_PLAYER_OBJECT, CPU_COUNT, NAMES };
