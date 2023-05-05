import BASE_DECK from "./constants";
import useGameStore from "./store";

export default function useGameActions() {
  const {
    gameStarted,
    setGameStarted,
    shuffledDeck,
    setShuffledDeck,
    setPlayerHand,
    setTable,
    setDealerHand,
    setResult,

    playerHand,
    dealerHand,
    table,
  } = useGameStore();

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

  const dealCards = () => {
    setGameStarted(true);
    setPlayerHand([shuffledDeck[0], shuffledDeck[2]]);
    setDealerHand([shuffledDeck[1], shuffledDeck[3]]);
    setTable(shuffledDeck.slice(4, 9));
  };

  const isRoyalFlush = (hand: Card[]): boolean => {
    return (
      isStraightFlush(hand) &&
      hand.some((c) => c.rank === "10") &&
      hand.some((c) => c.rank === "A")
    );
  };

  const isStraightFlush = (hand: Card[]): boolean => {
    return isStraight(hand) && isFlush(hand);
  };

  const isFourOfAKind = (hand: Card[]): boolean => {
    const ranks = hand.map((c) => c.rank);
    return ranks.some((r) => ranks.filter((rr) => rr === r).length === 4);
  };

  const isFullHouse = (hand: Card[]): boolean => {
    const ranks = hand.map((c) => c.rank);
    return (
      ranks.some((r) => ranks.filter((rr) => rr === r).length === 3) &&
      ranks.some((r) => ranks.filter((rr) => rr === r).length === 2)
    );
  };

  const isFlush = (hand: Card[]): boolean => {
    return hand.every((c) => c.suit === hand[0].suit);
  };

  const isStraight = (hand: Card[]): boolean => {
    const sortedRanks = hand.map((c) => c.value).sort((a, b) => a - b);
    return sortedRanks.every((r, i) => i === 0 || r === sortedRanks[i - 1] + 1);
  };

  const isThreeOfAKind = (hand: Card[]): boolean => {
    const ranks = hand.map((c) => c.rank);
    return ranks.some((r) => ranks.filter((rr) => rr === r).length === 3);
  };

  const isTwoPairs = (hand: Card[]): boolean => {
    const ranks = hand.map((c) => c.rank);
    const distinctRanks = [...new Set(ranks)];
    return (
      distinctRanks.length === 3 &&
      ranks.filter(
        (r) =>
          r === distinctRanks[0] ||
          r === distinctRanks[1] ||
          r === distinctRanks[2]
      ).length === 4
    );
  };

  const isOnePair = (hand: Card[]): boolean => {
    const ranks = hand.map((c) => c.rank);
    const distinctRanks = [...new Set(ranks)];
    return distinctRanks.length === 4;
  };

  const getPlay = (
    cards: Card[]
  ): {
    name: string;
    value: number;
  } => {
    const sortedCards = cards.sort((a, b) => b.value - a.value);
    console.log(sortedCards);

    // TODO: weight each play by its value
    // (e.g. a pair of 2s is better than a pair of 3s)

    if (isRoyalFlush(sortedCards)) {
      return { name: "Royal Flush", value: 22 };
    }

    if (isStraightFlush(sortedCards)) {
      return { name: "Straight Flush", value: 21 };
    }

    if (isFourOfAKind(sortedCards)) {
      return { name: "Four of a Kind", value: 20 };
    }

    if (isFullHouse(sortedCards)) {
      return { name: "Full House", value: 19 };
    }

    if (isFlush(sortedCards)) {
      return { name: "Flush", value: 18 };
    }

    if (isStraight(sortedCards)) {
      return { name: "Straight", value: 17 };
    }

    if (isThreeOfAKind(sortedCards)) {
      return { name: "Three of a Kind", value: 16 };
    }

    if (isTwoPairs(sortedCards)) {
      return { name: "Two Pair", value: 15 };
    }

    if (isOnePair(sortedCards)) {
      return { name: "Pair", value: 14 };
    }

    return { name: "High Card", value: sortedCards[0].value };
  };

  const getWinner = () => {
    if (!gameStarted) return;
    const playerCards = playerHand.concat(table);
    const dealerCards = dealerHand.concat(table);

    const playerPlay = getPlay(playerCards);
    const dealerPlay = getPlay(dealerCards);

    console.log(playerPlay, dealerPlay);

    if (playerPlay.value > dealerPlay.value) {
      setResult({ winner: "Jogador", play: playerPlay.name });
    } else if (playerPlay.value < dealerPlay.value) {
      setResult({ winner: "Dealer", play: dealerPlay.name });
    } else {
      setResult({ winner: "Tie", play: playerPlay.name });
    }
  };

  return {
    shuffleDeck,
    dealCards,
    getWinner,
    getPlay,
  };
}
