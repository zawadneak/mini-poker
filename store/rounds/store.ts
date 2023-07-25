import { create } from "zustand";
import { RoundStore } from "./types";
import { STARTING_MONEY } from "../poker/constants";

const roundStore = create<RoundStore>((set) => ({
  gameRound: 0,
  setGameRound: (gameRound) => set({ gameRound }),

  pot: 0,
  setPot: (pot) => set({ pot }),

  currentBet: 0,
  setCurrentBet: (currentBet) => set({ currentBet }),

  raiseToMatch: 0,
  setRaiseToMatch: (raiseToMatch) => set({ raiseToMatch }),

  bettingRound: 0,
  setBettingRound: (bettingRound) => set({ bettingRound }),

  bettingOrder: 0,
  setBettingOrder: (bettingOrder) => set({ bettingOrder }),

  playerMoney: STARTING_MONEY,
  setPlayerMoney: (playerMoney) => set({ playerMoney }),

  cpuMoney: STARTING_MONEY,
  setCpuMoney: (cpuMoney) => set({ cpuMoney }),

  cpuResponse: "WAITING",
  setCpuResponse: (cpuResponse) => set({ cpuResponse }),
}));

const useRoundStore = (): RoundStore => roundStore((state) => state);

export default useRoundStore;
