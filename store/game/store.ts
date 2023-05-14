import { create } from "zustand";

const gameStore = create<GameStore>((set) => ({
  gameStarted: false,
  setGameStarted: (gameStarted) => set({ gameStarted }),

  shuffledDeck: [],
  playerHand: [],
  dealerHand: [],
  table: [],
  setShuffledDeck: (shuffledDeck) => set({ shuffledDeck }),
  setPlayerHand: (playerHand) => set({ playerHand }),
  setDealerHand: (dealerHand) => set({ dealerHand }),
  setTable: (table) => set({ table }),

  result: null,
  setResult: (result) => set({ result }),
}));

export default function useGameStore(): GameStore {
  return gameStore((state) => state);
}
