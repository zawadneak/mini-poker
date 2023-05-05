import BASE_DECK from "./constants";
import useGameStore from "./store";

export default function useGameActions() {
  const { setShuffledDeck } = useGameStore();

  const shuffleDeck = () => {
    // Fisher-Yates shuffle
    const shuffledDeck = (): Deck => {
      let deck = [...BASE_DECK];

      for (let i = BASE_DECK.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
      return deck;
    };

    setShuffledDeck(shuffledDeck());
  };

  return {
    shuffleDeck,
  };
}
