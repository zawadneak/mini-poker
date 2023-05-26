import {
  FLUSH,
  FOUR_OF_A_KIND,
  FULL_HOUSE,
  PAIR,
  ROYAL_FLUSH,
  STRAIGHT,
  STRAIGHT_FLUSH,
  THREE_OF_A_KIND,
  TWO_PAIR,
} from "./constants";

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
  return (
    ranks.filter((r) => ranks.filter((rr) => rr === r).length === 2).length ===
    4
  );
};

const isOnePair = (hand: Card[]): boolean => {
  return hand.some((c) => hand.filter((cc) => cc.rank === c.rank).length === 2);
};

const getFlushSuit = (hand: Card[]): Suits | string => {
  const suits = hand.reduce((acc, c) => {
    if (c.suit in acc) {
      acc[c.suit]++;
    } else {
      acc[c.suit] = 1;
    }
    return acc;
  }, {} as { [key in Suits]: number });

  const flushSuit =
    Object.entries(suits).find(([_, count]) => count >= 5)?.[0] || null;
  return flushSuit;
};

const getHandStrength = (
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
    return { name: "Royal Flush", value: ROYAL_FLUSH + 99 };
  }

  if (isStraightFlush(sortedCards)) {
    const removedNonFlushCards = sortedCards.filter(
      (c) => c.suit === getFlushSuit(sortedCards)
    );

    return {
      name: "Straight Flush",
      value: removedNonFlushCards[0].value + STRAIGHT_FLUSH,
    };
  }

  if (isFourOfAKind(sortedCards)) {
    const fourOfAKindValue = sortedCards.find(
      (c) => sortedCards.filter((cc) => cc.rank === c.rank).length === 4
    )?.value;

    return { name: "Four of a Kind", value: fourOfAKindValue + FOUR_OF_A_KIND };
  }

  if (isFullHouse(sortedCards)) {
    const fullHouseValue = sortedCards.find(
      (c) => sortedCards.filter((cc) => cc.rank === c.rank).length === 3
    )?.value;

    return { name: "Full House", value: FULL_HOUSE + fullHouseValue };
  }

  if (isFlush(sortedCards)) {
    return { name: "Flush", value: FLUSH };
  }

  if (isStraight(sortedCards)) {
    const cardsInStraight = sortedCards.filter(
      (c, i) => i === 0 || c.value === sortedCards[i - 1].value + 1
    );

    return { name: "Straight", value: STRAIGHT + cardsInStraight[0].value };
  }

  if (isThreeOfAKind(sortedCards)) {
    const threeOfAKindValue = sortedCards.find(
      (c) => sortedCards.filter((cc) => cc.rank === c.rank).length === 3
    )?.value;

    return {
      name: "Three of a Kind",
      value: THREE_OF_A_KIND + threeOfAKindValue,
    };
  }

  if (isTwoPairs(sortedCards)) {
    const pairValue = sortedCards.find(
      (c) => sortedCards.filter((cc) => cc.rank === c.rank).length === 2
    )?.value;

    return { name: "Two Pair", value: TWO_PAIR + pairValue };
  }

  if (isOnePair(sortedCards)) {
    const pairValue = sortedCards.find(
      (c) => sortedCards.filter((cc) => cc.rank === c.rank).length === 2
    )?.value;

    return { name: "Pair", value: PAIR + pairValue };
  }

  return { name: "High Card", value: sortedCards[0].value };
};

export {
  isRoyalFlush,
  isStraightFlush,
  isFourOfAKind,
  isFullHouse,
  isFlush,
  isStraight,
  isThreeOfAKind,
  isTwoPairs,
  isOnePair,
  getFlushSuit,
};

export default getHandStrength;
