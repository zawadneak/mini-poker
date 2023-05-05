import { create } from "zustand";

const gameStore = create<GameStore>((set) => ({
  shuffledDeck: [],
  setShuffledDeck: (shuffledDeck) => set({ shuffledDeck }),
}));

export default function useGameStore(): GameStore {
  return gameStore((state) => state);
}
