import { StateCreator, create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

import { PlayerStore } from "./types";
import { produce } from "immer";

const playerStore = create(
  subscribeWithSelector((set) => ({
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
  }))
);

export { playerStore };

export default function usePlayerStore(): PlayerStore {
  return playerStore((state) => state);
}
