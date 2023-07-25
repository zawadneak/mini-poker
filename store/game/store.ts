import { produce } from "immer";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { PlayerStore } from "../players/types";

const gameStore = create<GameStore>((set) => ({
  gameStarted: false,
  setGameStarted: (gameStarted) =>
    set(
      produce((state) => {
        state.gameStarted = gameStarted;
      })
    ),

  shuffledDeck: [],
  table: [],
  setShuffledDeck: (shuffledDeck) =>
    set(
      produce((state) => {
        state.shuffledDeck = shuffledDeck;
      })
    ),
  setTable: (table) =>
    set(
      produce((state) => {
        state.table = table;
      })
    ),

  result: null,
  setResult: (result) =>
    set(
      produce((state) => {
        state.result = result;
      })
    ),

  gameRound: 0,
  setGameRound: (gameRound) =>
    set(
      produce((state) => {
        state.gameRound = gameRound;
      })
    ),

  // total bets in the pot
  pot: 0,
  setPot: (pot) =>
    set(
      produce((state) => {
        state.pot = pot;
      })
    ),

  // bet to match
  currentBet: 0,
  setCurrentBet: (currentBet) =>
    set(
      produce((state) => {
        state.currentBet = currentBet;
      })
    ),

  // current hand betting round
  bettingRound: 0,
  setBettingRound: (bettingRound) =>
    set(
      produce((state) => {
        state.bettingRound = bettingRound;
      })
    ),

  // current player betting order
  bettingOrder: 0,
  setBettingOrder: (bettingOrder) =>
    set(
      produce((state) => {
        state.bettingOrder = bettingOrder;
      })
    ),

  bettingOrderSequence: [],
  setBettingOrderSequence: (bettingOrderSequence) =>
    set(
      produce((state) => {
        state.bettingOrderSequence = bettingOrderSequence;
      })
    ),
}));

export { gameStore };

export default function useGameStore(): GameStore {
  return gameStore((state) => state);
}
