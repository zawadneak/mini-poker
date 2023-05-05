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
  shuffledDeck: Deck;
  setShuffledDeck: (deck: Deck) => void;
}
