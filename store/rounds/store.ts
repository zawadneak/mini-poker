import { create } from "zustand";
import { RoundStore } from "./types";

const roundStore = create<RoundStore>((set) => ({
  gameRound: 0,
  setGameRound: (gameRound) => set({ gameRound }),

  pot: 0,
  setPot: (pot) => set({ pot }),

  currentBet: 0,
  setCurrentBet: (currentBet) => set({ currentBet }),

  bettingRound: 0,
  setBettingRound: (bettingRound) => set({ bettingRound }),
}));

const useRoundStore = (): RoundStore => roundStore((state) => state);

export default useRoundStore;
