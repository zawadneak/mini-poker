import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { PlayerStore } from "./types";

const playerStore = create(
  immer<PlayerStore>((set) => ({
    mainPlayer: null,
    setPlayer: (mainPlayer) => set({ mainPlayer }),

    cpus: {},
    setCpus: (cpus) => set({ cpus }),
  }))
);

export { playerStore };

export default function usePlayerStore(): PlayerStore {
  return playerStore((state) => state);
}
