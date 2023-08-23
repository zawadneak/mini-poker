import { produce } from "immer";
import { BASE_PLAYER_OBJECT, CPU_COUNT, NAMES } from "./constants";
import usePlayerStore, { playerStore } from "./store";
import { Player } from "./types";
import PROFILES from "./cpu/profiles";

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
        profile: PROFILES.Conservative,
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
    const { cpus, mainPlayer } = playerStore.getState();
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
          blindCompleted: false,
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
      blindCompleted: false,
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
    const { cpus, mainPlayer } = playerStore.getState();
    console.log("SETTINGS AS BIG BLIND", playerId);
    if (playerId === "mainPlayer") {
      setPlayer({
        ...mainPlayer,
        isBigBlind: true,
      });
      return;
    }

    const newCpus = produce(cpus, (draft) => {
      draft[playerId] = {
        ...draft[playerId],
        isBigBlind: true,
      };
    });

    setCpus(newCpus);
  };

  const setAsSmallBlind = (playerId: string) => {
    const { cpus, mainPlayer } = playerStore.getState();

    console.log("SETTINGS AS SMALL BLIND", playerId);

    if (playerId === "mainPlayer") {
      setPlayer({
        ...mainPlayer,
        isSmallBlind: true,
        isTurn: true,
      });
      return;
    }

    const newCpus = produce(cpus, (draft) => {
      draft[playerId] = {
        ...draft[playerId],
        isSmallBlind: true,
        isTurn: true,
      };
    });

    setCpus(newCpus);
  };

  const setPlayerTurn = (playerId: string) => {
    // console.log("SETTING PLAYER TURN");
    const { mainPlayer: updatedMainPlayer, cpus: updatedCpus } =
      playerStore.getState();

    if (playerId === "mainPlayer") {
      setPlayer({
        ...updatedMainPlayer,
        isTurn: true,
        hasBetted: false,
      });
      return;
    }

    let newCpus = produce(updatedCpus, (draft) => {
      draft[playerId] = {
        ...draft[playerId],
        isTurn: true,
      };
    });

    setCpus(newCpus);
  };

  const resetPlayersStatus = () => {
    const newCpus = produce(playerStore.getState().cpus, (draft) => {
      Object.values(draft).forEach((cpu) => {
        if (cpu.status === "FOLD") return;
        draft[cpu.id].status = null;
        draft[cpu.id].bet = 0;
        draft[cpu.id].hasBetted = false;
      });
    });

    setCpus(newCpus);

    if (playerStore.getState().mainPlayer.status === "FOLD") return;

    setPlayer({
      ...playerStore.getState().mainPlayer,
      status: null,
      bet: 0,
    });
  };

  const addMoneyToPlayer = (playerId: string, amount: number) => {
    console.log("ADDING MONEY TO PLAYER " + playerId + " AMOUNT " + amount);

    if (playerId === "mainPlayer") {
      const updatedPlayerData = playerStore.getState().mainPlayer;

      console.log(updatedPlayerData.money + amount);

      setPlayer({
        ...updatedPlayerData,
        money: updatedPlayerData.money + amount,
      });
      return;
    }

    const newCpus = produce(playerStore.getState().cpus, (draft) => {
      draft[playerId].money += amount;
    });

    setCpus(newCpus);
  };

  const getPlayer = (playerId: string): Player => {
    if (playerId === "mainPlayer") {
      return playerStore.getState().mainPlayer;
    }
    return playerStore.getState().cpus[playerId];
  };

  const clearAllPlayers = () => {
    setPlayer(null);
    setCpus({});
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
    resetPlayersStatus,
    addMoneyToPlayer,
    getPlayer,
    clearAllPlayers,
  };
}
