const BASE_DECK = [
  { id: "AH", suit: "hearts", rank: "A", value: 14 },
  { id: "2H", suit: "hearts", rank: "2", value: 2 },
  { id: "3H", suit: "hearts", rank: "3", value: 3 },
  { id: "4H", suit: "hearts", rank: "4", value: 4 },
  { id: "5H", suit: "hearts", rank: "5", value: 5 },
  { id: "6H", suit: "hearts", rank: "6", value: 6 },
  { id: "7H", suit: "hearts", rank: "7", value: 7 },
  { id: "8H", suit: "hearts", rank: "8", value: 8 },
  { id: "9H", suit: "hearts", rank: "9", value: 9 },
  { id: "10H", suit: "hearts", rank: "10", value: 10 },
  { id: "JH", suit: "hearts", rank: "J", value: 11 },
  { id: "QH", suit: "hearts", rank: "Q", value: 12 },
  { id: "KH", suit: "hearts", rank: "K", value: 13 },
  { id: "AD", suit: "diamonds", rank: "A", value: 14 },
  { id: "2D", suit: "diamonds", rank: "2", value: 2 },
  { id: "3D", suit: "diamonds", rank: "3", value: 3 },
  { id: "4D", suit: "diamonds", rank: "4", value: 4 },
  { id: "5D", suit: "diamonds", rank: "5", value: 5 },
  { id: "6D", suit: "diamonds", rank: "6", value: 6 },
  { id: "7D", suit: "diamonds", rank: "7", value: 7 },
  { id: "8D", suit: "diamonds", rank: "8", value: 8 },
  { id: "9D", suit: "diamonds", rank: "9", value: 9 },
  { id: "10D", suit: "diamonds", rank: "10", value: 10 },
  { id: "JD", suit: "diamonds", rank: "J", value: 11 },
  { id: "QD", suit: "diamonds", rank: "Q", value: 12 },
  { id: "KD", suit: "diamonds", rank: "K", value: 13 },
  { id: "AS", suit: "spades", rank: "A", value: 14 },
  { id: "2S", suit: "spades", rank: "2", value: 2 },
  { id: "3S", suit: "spades", rank: "3", value: 3 },
  { id: "4S", suit: "spades", rank: "4", value: 4 },
  { id: "5S", suit: "spades", rank: "5", value: 5 },
  { id: "6S", suit: "spades", rank: "6", value: 6 },
  { id: "7S", suit: "spades", rank: "7", value: 7 },
  { id: "8S", suit: "spades", rank: "8", value: 8 },
  { id: "9S", suit: "spades", rank: "9", value: 9 },
  { id: "10S", suit: "spades", rank: "10", value: 10 },
  { id: "JS", suit: "spades", rank: "J", value: 11 },
  { id: "QS", suit: "spades", rank: "Q", value: 12 },
  { id: "KS", suit: "spades", rank: "K", value: 13 },
  { id: "AC", suit: "clubs", rank: "A", value: 14 },
  { id: "2C", suit: "clubs", rank: "2", value: 2 },
  { id: "3C", suit: "clubs", rank: "3", value: 3 },
  { id: "4C", suit: "clubs", rank: "4", value: 4 },
  { id: "5C", suit: "clubs", rank: "5", value: 5 },
  { id: "6C", suit: "clubs", rank: "6", value: 6 },
  { id: "7C", suit: "clubs", rank: "7", value: 7 },
  { id: "8C", suit: "clubs", rank: "8", value: 8 },
  { id: "9C", suit: "clubs", rank: "9", value: 9 },
  { id: "10C", suit: "clubs", rank: "10", value: 10 },
  { id: "JC", suit: "clubs", rank: "J", value: 11 },
  { id: "QC", suit: "clubs", rank: "Q", value: 12 },
  { id: "KC", suit: "clubs", rank: "K", value: 13 },
];

const HIGH_CARD = 1;
const PAIR = 100;
const TWO_PAIR = 200;
const THREE_OF_A_KIND = 300;
const STRAIGHT = 400;
const FLUSH = 500;
const FULL_HOUSE = 600;
const FOUR_OF_A_KIND = 700;
const STRAIGHT_FLUSH = 800;
const ROYAL_FLUSH = 900;

const BLUFF_CHANCE = 0.01;

// 1 2 3
const DIFFICULTY = 3;

const RAISE_AMOUNT = [5, 10, 20, 50];

const STARTING_MONEY = 100;

const BIG_BLIND_BET = 2;

const SMALL_BLIND_BET = 1;

export {
  HIGH_CARD,
  PAIR,
  TWO_PAIR,
  THREE_OF_A_KIND,
  STRAIGHT,
  FLUSH,
  FULL_HOUSE,
  FOUR_OF_A_KIND,
  STRAIGHT_FLUSH,
  ROYAL_FLUSH,
  BLUFF_CHANCE,
  RAISE_AMOUNT,
  DIFFICULTY,
  STARTING_MONEY,
  BIG_BLIND_BET,
  SMALL_BLIND_BET,
};

export default BASE_DECK;
