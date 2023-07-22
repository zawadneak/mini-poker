import { produce } from "immer";
import { BASE_PLAYER_OBJECT, CPU_COUNT, NAMES } from "./constants";
import usePlayerStore from "./store";
import { Player } from "./types";

export default function usePlayerActions() {
  const { mainPlayer, cpus, setPlayer, setCpus } = usePlayerStore();

  const initPlayers = () => {
    setPlayer({
      ...BASE_PLAYER_OBJECT,
      id: "mainPlayer",
      name: "Lucas",
    });

    const newCpus = [];
    Array.from(Array(CPU_COUNT)).forEach((_, i) => {
      newCpus.push({
        ...BASE_PLAYER_OBJECT,
        id: `cpu-${i}`,
        name: NAMES[Math.floor(Math.random() * NAMES.length)],
      });
    });

    setCpus(newCpus);
  };

  const resetPlayersRound = () => {
    const newCpus = produce(cpus, (draft) => {
      draft.forEach((cpu) => {
        cpu.bet = 0;
        cpu.hand = [];
        cpu.hasBetted = false;
        cpu.isBigBlind = false;
        cpu.isSmallBlind = false;
        cpu.isTurn = false;
        cpu.isWinner = false;
        cpu.status = null;
      });
    });

    setCpus(newCpus);

    setPlayer({
      ...mainPlayer,
      bet: 0,
      hand: [],
      hasBetted: false,
      isBigBlind: false,
      isSmallBlind: false,
      isTurn: false,
      isWinner: false,
      status: null,
    });
  };

  //   TODO: consider big blind and small blind + game rotations
  const assignCardsToPlayers = (shuffledDeck: Deck): Deck => {
    const newCpus = produce(cpus, (draft) => {
      draft.forEach((cpu) => {
        cpu.hand = [];
      });

      draft.forEach((cpu) => {
        cpu.hand.push(shuffledDeck.pop());
        cpu.hand.push(shuffledDeck.pop());
      });
    });

    setCpus(newCpus);

    setPlayer({
      ...mainPlayer,
      hand: [shuffledDeck.pop(), shuffledDeck.pop()],
    });

    return shuffledDeck;
  };

  const resetPlayersHasBetted = () => {
    const newCpus = produce(cpus, (draft) => {
      draft.forEach((cpu) => {
        cpu.hasBetted = false;
      });
    });

    setCpus(newCpus);

    setPlayer({
      ...mainPlayer,
      hasBetted: false,
    });
  };

  const setCpu = (cpu: Player) => {
    const newCpus = produce(cpus, (draft) => {
      const index = draft.findIndex((c) => c.id === cpu.id);

      draft[index] = cpu;
    });

    setCpus(newCpus);
  };

  return {
    initPlayers,
    assignCardsToPlayers,
    resetPlayersHasBetted,
    setCpu,
    resetPlayersRound,
  };
}
