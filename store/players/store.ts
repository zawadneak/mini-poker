import { StateCreator, create } from "zustand";

import { PlayerStore } from "./types";
import { produce } from "immer";

const playerStore = create<PlayerStore>((set) => ({
  mainPlayer: null,
  setPlayer: (mainPlayer) =>
    set(
      produce((state) => {
        state.mainPlayer = mainPlayer;
      })
    ),

  cpus: {},
  setCpus: (cpus) =>
    set(
      produce((state) => {
        state.cpus = cpus;
      })
    ),
  tableVariance: 0,
  setTableVariance: (tableVariance) =>
    set(
      produce((state) => {
        state.tableVariance = tableVariance;
      })
    ),
  tableStandardDeviation: 0,
  setTableStandardDeviation: (tableStandardDeviation) =>
    set(
      produce((state) => {
        state.tableStandardDeviation = tableStandardDeviation;
      })
    ),

  playStatistics: [],
  setPlayStatistics: (playStatistics) => set({ playStatistics }),
}));

export { playerStore };

export default function usePlayerStore(): PlayerStore {
  return playerStore((state) => state);
}
