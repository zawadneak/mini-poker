import { produce } from "immer";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { PlayerStore } from "../players/types";
import { CPU_COUNT } from "../players/constants";
import { BIG_BLIND_BET, STARTING_MONEY } from "../poker/constants";

import GameStore from "./types";

const gameStore = create<GameStore>((set) => ({
  gameStarted: false,
  setGameStarted: (gameStarted) =>
    set(
      produce((state) => {
        state.gameStarted = gameStarted;
      })
    ),

  gameOver: false,
  setGameOver: (gameOver) =>
    set(
      produce((state) => {
        state.gameOver = gameOver;
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

  raiseCount: 0,
  setRaiseCount: (raiseCount) =>
    set(
      produce((state) => {
        state.raiseCount = raiseCount;
      })
    ),

  // sequencia que define a rodada de apostas inicial
  // + big e small
  bettingOrderSequence: [],
  setBettingOrderSequence: (bettingOrderSequence) =>
    set(
      produce((state) => {
        state.bettingOrderSequence = bettingOrderSequence;
      })
    ),

  roundOrderSequence: null,
  setRoundOrderSequence: (roundOrderSequence) =>
    set(
      produce((state) => {
        state.roundOrderSequence = roundOrderSequence;
      })
    ),

  gameTime: 0,
  setGameTime: (gameTime) =>
    set(
      produce((state) => {
        state.gameTime = gameTime;
      })
    ),

  // game config

  cpuQuantity: CPU_COUNT,
  setCpuQuantity: (cpuQuantity) =>
    set(
      produce((state) => {
        state.cpuQuantity = cpuQuantity;
      })
    ),

  startingMoney: STARTING_MONEY,
  setStartingMoney: (startingMoney) =>
    set(
      produce((state) => {
        state.startingMoney = startingMoney;
      })
    ),

  startingBlind: BIG_BLIND_BET,
  setStartingBlind: (startingBlind) =>
    set(
      produce((state) => {
        state.startingBlind = startingBlind;
      })
    ),
  differentProfiles: false,
  setDifferentProfiles: (differentProfiles) =>
    set(
      produce((state) => {
        state.differentProfiles = differentProfiles;
      })
    ),

  showBotProfile: false,
  setShowBotProfile: (showBotProfile) =>
    set(
      produce((state) => {
        state.showBotProfile = showBotProfile;
      })
    ),

  setStore: (store) =>
    set(
      produce((state) => {
        Object.keys(store).forEach((key) => {
          state[key] = store[key];
        });
      })
    ),
}));

export { gameStore };

export default function useGameStore(): GameStore {
  return gameStore((state) => state);
}
