import { produce } from "immer";
import { BASE_PLAYER_OBJECT, CPU_COUNT, NAMES } from "./constants";
import usePlayerStore, { playerStore } from "./store";
import { Player } from "./types";
import { BIG_BLIND_BET, SMALL_BLIND_BET } from "../poker/constants";

export default function usePlayerActions() {
  const { mainPlayer, cpus, setPlayer, setCpus } = usePlayerStore();

  const initPlayers = async (): Promise<{
    mainPlayer: Player;
    cpus: {
      [key: string]: Player;
    };
  }> => {
    const playerObj = {
      ...BASE_PLAYER_OBJECT,
      id: "mainPlayer",
      name: "Lucas",
      isSmallBlind: true,
      isTurn: true,
    };

    setPlayer(playerObj);

    let newCpus = {};
    [...Array(CPU_COUNT).fill(null)].forEach((_, i) => {
      // console.log("INIT CPU " + i);
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

      Object.assign(newCpus, {
        [`cpu-${i}`]: cpuBaseObject,
      });
    });

    setCpus(newCpus);

    return {
      mainPlayer: playerObj,
      cpus: newCpus,
    };
  };

  const resetPlayersRound = () => {
    const newCpus = produce(cpus, (draft) => {
      Object.values(cpus).map((cpu) => {
        draft[cpu.id] = {
          ...cpu,
          bet: 0,
          hand: [],
          hasBetted: false,
          isBigBlind: false,
          isSmallBlind: false,
          isTurn: false,
          isWinner: false,
          status: null,
        };
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
    localCPUS: {
      [key: string]: Player;
    },
    player: Player
  ): Promise<Deck> => {
    let newShuffledDeck = [...shuffledDeck];

    const newCpus = await produce(localCPUS, (draft) => {
      Object.values(draft).forEach((cpu) => {
        draft[cpu.id].hand = [];
        draft[cpu.id].hand.push(newShuffledDeck.pop());
        draft[cpu.id].hand.push(newShuffledDeck.pop());
      });
    });

    setCpus(newCpus);

    setPlayer({
      ...player,
      hand: [newShuffledDeck.pop(), newShuffledDeck.pop()],
    });

    return newShuffledDeck;
  };

  const resetPlayersHasBetted = () => {
    const newCpus = produce(cpus, (draft) => {
      Object.values(draft).forEach((cpu) => {
        draft[cpu.id].hasBetted = false;
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
      draft[cpu.id] = cpu;
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

    const newCpus = { ...cpus };

    newCpus[playerId] = {
      ...newCpus[playerId],
      isBigBlind: true,
    };

    setCpus(newCpus);
  };

  const setAsSmallBlind = (playerId: string) => {
    if (playerId === "mainPlayer") {
      setPlayer({
        ...mainPlayer,
        isSmallBlind: true,
        isTurn: true,
      });
      return;
    }

    const newCpus = { ...cpus };

    newCpus[playerId] = {
      ...newCpus[playerId],
      isSmallBlind: true,
    };
    setCpus(newCpus);
  };

  const setPlayerTurn = (playerId: string) => {
    // console.log("SETTING PLAYER TURN");
    const { mainPlayer: updatedMainPlayer, cpus: updatedCpus } =
      playerStore.getState();

    if (playerId === "mainPlayer") {
      return {
        ...updatedMainPlayer,
        isTurn: true,
      };
    }

    let newCpus = produce(updatedCpus, (draft) => {
      draft[playerId] = {
        ...draft[playerId],
        isTurn: true,
      };
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
