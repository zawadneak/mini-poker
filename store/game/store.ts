import { create } from "zustand";

const gameStore = create<GameStore>((set) => ({
  gameStarted: false,
  setGameStarted: (gameStarted) => set({ gameStarted }),

  shuffledDeck: [],
  table: [],
  setShuffledDeck: (shuffledDeck) => set({ shuffledDeck }),
  setTable: (table) => set({ table }),

  result: null,
  setResult: (result) => set({ result }),

  gameRound: 0,
  setGameRound: (gameRound) => set({ gameRound }),

  // total bets in the pot
  pot: 0,
  setPot: (pot) => set({ pot }),

  // bet to match
  currentBet: 0,
  setCurrentBet: (currentBet) => set({ currentBet }),

  // current hand betting round
  bettingRound: 0,
  setBettingRound: (bettingRound) => set({ bettingRound }),

  // current player betting order
  bettingOrder: 0,
  setBettingOrder: (bettingOrder) => set({ bettingOrder }),

  bettingOrderSequence: [],
  setBettingOrderSequence: (bettingOrderSequence) =>
    set({ bettingOrderSequence }),
}));

export { gameStore };

export default function useGameStore(): GameStore {
  return gameStore((state) => state);
}
