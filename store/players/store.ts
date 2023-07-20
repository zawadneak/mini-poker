import { create } from "zustand";
import { PlayerStore } from "./types";

const playerStore = create<PlayerStore>((set) => ({
  mainPlayer: null,
  setPlayer: (mainPlayer) => set({ mainPlayer }),

  cpus: [],
  setCpus: (cpus) => set({ cpus }),
}));

export default function usePlayerStore(): PlayerStore {
  return playerStore((state) => state);
}
