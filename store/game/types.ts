import DefaultStore from "../types";

type Suits = "hearts" | "diamonds" | "spades" | "clubs";
export type Card = {
  id: string;
  suit: Suits | string;
  rank:
    | "A"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "J"
    | "Q"
    | "K"
    | string;
  value: number;
};

type Deck = Card[];

// card example
// { id: "4H", suit: "hearts", rank: "4", value: 4 },

interface GameStore extends DefaultStore {
  gameStarted: boolean;

  setGameStarted: (gameStarted: boolean) => void;

  gameOver: boolean;
  setGameOver: (gameOver: boolean) => void;

  shuffledDeck: Deck;
  table: Deck;

  setShuffledDeck: (deck: Deck) => void;
  setTable: (deck: Deck) => void;

  result: Result | null;
  setResult: (result: Result) => void;

  gameRound: number;
  setGameRound: (gameRound: number) => void;

  // total bets in the pot
  pot: number;
  setPot: (pot: number) => void;

  // bet to match
  currentBet: number;
  setCurrentBet: (currentBet: number) => void;

  // // current hand betting round
  // bettingRound: number;
  // setBettingRound: (bettingRound: number) => void;

  // current player betting order
  bettingOrder: number;
  setBettingOrder: (bettingOrder: number) => void;

  /**
   * The order of the players in the betting round
   * Serves as a base for rounds
   * Not
   *
   * @example
   * 0 -> Small Blind
   * 1 -> Big Blind
   * n -> Player N
   * n + 1 -> Player N + 1
   */
  bettingOrderSequence: string[];
  setBettingOrderSequence: (bettingOrderSequence: string[]) => void;

  /**
   * The order of the players in the round
   * If a player folds, he is removed from the round
   * If a player raises, he is moved to the end of the round
   */
  roundOrderSequence: string[];
  setRoundOrderSequence: (roundOrderSequence: string[]) => void;

  // in seconds
  gameTime: number;
  setGameTime: (gameTime: number) => void;

  // game config
  cpuQuantity: number;
  setCpuQuantity: (cpuQuantity: number) => void;

  startingMoney: number;
  setStartingMoney: (startingMoney: number) => void;

  differentProfiles: boolean;
  setDifferentProfiles: (differentProfiles: boolean) => void;

  showBotProfile: boolean;
  setShowBotProfile: (showBotProfile: boolean) => void;

  raiseCount: number;
  setRaiseCount: (raiseCount: number) => void;
}

type Result = {
  winner: "Jogador" | string | "Tie";
  play: string;

  // if there is a tie, the pot is split between the players
  splitBetween?: string[];
};

type Plays = "StraightFlush" | "F";

export default GameStore;
