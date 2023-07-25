import { produce } from "immer";
import { BASE_PLAYER_OBJECT, CPU_COUNT, NAMES } from "./constants";
import usePlayerStore, { playerStore } from "./store";
import { Player } from "./types";
import { BIG_BLIND_BET, SMALL_BLIND_BET } from "../poker/constants";

export default function usePlayerActions() {
  const { mainPlayer, cpus, setPlayer, setCpus } = playerStore(
    (state) => state
  );

  const initPlayers = async (): Promise<{
    mainPlayer: Player;
    cpus: Player[];
  }> => {
    setPlayer({
      ...BASE_PLAYER_OBJECT,
      id: "mainPlayer",
      name: "Lucas",
      isSmallBlind: true,
      isTurn: true,
    });

    let newCpus = [];
    await Array.from(Array(CPU_COUNT)).forEach((_, i) => {
      console.log("INIT CPU " + i);
      let cpuBaseObject = {
        ...BASE_PLAYER_OBJECT,
        id: `cpu-${i}`,
        name: NAMES[Math.floor(Math.random() * NAMES.length)],
      };

      // IS BIG BLIND?
      if (i === 0) {
        cpuBaseObject = {
          ...cpuBaseObject,
          isBigBlind: true,
        };
      }

      newCpus.push(cpuBaseObject);
    });

    setCpus(newCpus);

    return {
      mainPlayer,
      cpus,
    };
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
  const assignCardsToPlayers = async (
    shuffledDeck: Deck,
    localCPUS: Player[]
  ): Promise<Deck> => {
    const newCpus = await produce(localCPUS, (draft) => {
      draft.forEach((cpu) => {
        cpu.hand = [];
      });

      draft.forEach((cpu) => {
        cpu.hand.push(shuffledDeck.pop());
        cpu.hand.push(shuffledDeck.pop());
      });
    });

    console.log(newCpus);

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

  const setAsBigBlind = (playerId: string) => {
    if (playerId === "mainPlayer") {
      setPlayer({
        ...mainPlayer,
        isBigBlind: true,
      });
      return;
    }

    const newCpus = produce(cpus, (draft) => {
      const index = draft.findIndex((c) => c.id === playerId);

      draft[index] = {
        ...draft[index],
        isBigBlind: true,
      };
    });

    setCpus(newCpus);
  };

  const setAsSmallBlind = (playerId: string) => {
    if (playerId === "mainPlayer") {
      setPlayer({
        ...mainPlayer,
        isSmallBlind: true,
        isTurn: true,
      });
    }

    const newCpus = produce(cpus, (draft) => {
      const index = draft.findIndex((c) => c.id === playerId);

      draft[index] = {
        ...draft[index],
        isSmallBlind: true,
      };
    });

    setCpus(newCpus);
  };

  const setPlayerTurn = (playerId: string) => {
    if (playerId === "mainPlayer") {
      setPlayer({
        ...mainPlayer,
        isTurn: true,
      });
    }

    const newCpus = produce(cpus, (draft) => {
      const index = draft.findIndex((c) => c.id === playerId);

      if (index >= 0) {
        draft[index] = {
          ...draft[index],
          isTurn: true,
        };
      }

      draft.forEach((cpu) => {
        if (cpu.id !== playerId) {
          cpu.isTurn = false;
        }
      });
    });

    setCpus(newCpus);
  };

  return {
    initPlayers,
    assignCardsToPlayers,
    resetPlayersHasBetted,
    setCpu,
    resetPlayersRound,
    setAsBigBlind,
    setAsSmallBlind,
    setPlayerTurn,
  };
}
