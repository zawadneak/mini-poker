type Suits = "hearts" | "diamonds" | "spades" | "clubs";
type Card = {
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

interface GameStore {
  gameStarted: boolean;

  setGameStarted: (gameStarted: boolean) => void;

  shuffledDeck: Deck;
  playerHand: Deck;
  dealerHand: Deck;
  table: Deck;

  setShuffledDeck: (deck: Deck) => void;
  setPlayerHand: (deck: Deck) => void;
  setDealerHand: (deck: Deck) => void;
  setTable: (deck: Deck) => void;

  result: Result | null;
  setResult: (result: Result) => void;
}

type Result = {
  winner: "Jogador" | string | "Tie";
  play: string;
};

type Plays = "StraightFlush" | "F";
