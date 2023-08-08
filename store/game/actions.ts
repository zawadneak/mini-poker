import { produce } from "immer";
import usePlayerStore, { playerStore } from "../players/store";
import BASE_DECK, { STARTING_MONEY } from "../poker/constants";
import getHandStrength from "../poker/handCheck";
import useGameStore, { gameStore } from "./store";
import usePlayerActions from "../players/actions";
import { Player } from "../players/types";
import useCPUSimulation from "../players/cpu/simulation";

export default function useGameActions() {
  const {
    gameStarted,
    setGameStarted,
    shuffledDeck,
    setShuffledDeck,
    setTable,
    setResult,
    gameRound,
    setPot,
    setGameRound,
    setCurrentBet,
    setBettingOrderSequence,
    setBettingOrder,
    bettingOrderSequence,
    bettingOrder,
    setRoundOrderSequence,
    roundOrderSequence,
    table,
    result,
  } = useGameStore();

  const { handleGetTableStatistics } = useCPUSimulation();

  const { mainPlayer, cpus, setPlayer, setCpus } = usePlayerStore();

  const {
    assignCardsToPlayers,
    initPlayers,
    resetPlayersRound,
    setAsSmallBlind,
    setAsBigBlind,
    setPlayerTurn,
    resetPlayersStatus,
    addMoneyToPlayer,
  } = usePlayerActions();

  const cpuSimulation = useCPUSimulation();

  function resetGameMoney() {
    setPot(0);
  }

  function resetRound() {
    setBettingOrder(0);
    setGameRound(0);
    setCurrentBet(0);
    setPot(0);
  }

  function nextGameRound() {
    setBettingOrder(0);
    setCurrentBet(0);

    if (gameRound === 3) {
      getWinner();
    } else {
      setGameRound(gameRound + 1);
    }
  }

  const resetGame = () => {
    resetPlayersRound();
    setGameStarted(false);
    setTable([]);
    setResult(null);

    if (mainPlayer.money === 0) {
      setPlayer({
        ...mainPlayer,
        money: STARTING_MONEY,
      });
      alert("Game Over");
    }
  };

  const shuffleDeck = (): Deck => {
    let deck = [...BASE_DECK];

    for (let i = BASE_DECK.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setShuffledDeck(deck);

    return deck;
  };

  const dealCards = async () => {
    const { cpus, mainPlayer: player } = playerStore.getState();

    const localShuffledDeck = shuffleDeck();

    const tableCards = await assignCardsToPlayers(
      localShuffledDeck,
      cpus,
      player
    );

    setTable(tableCards.splice(0, 5));
  };

  const getWinner = () => {
    if (!gameStarted) return;

    const roundOrder = gameStore.getState().roundOrderSequence;
    const mainPlayer = playerStore.getState().mainPlayer;

    let playerHandStrength = {
      ...mainPlayer,
      hand: mainPlayer.hand.concat(table),
      handStrength: getHandStrength(mainPlayer.hand.concat(table)),
    };

    if (mainPlayer.status === "FOLD") {
      playerHandStrength.handStrength = {
        value: 0,
        name: "Folded",
      };
    }

    const cpuHandStrength: Player[] = Object.values(
      produce(cpus, (draft) => {
        Object.values(cpus).forEach((cpu: Player) => {
          if (!roundOrder.includes(cpu.id)) {
            draft[cpu.id].handStrength = {
              value: 0,
              name: "Folded",
            };
            return;
          }

          draft[cpu.id].hand = draft[cpu.id].hand.concat(table);
          draft[cpu.id].handStrength = getHandStrength(draft[cpu.id].hand);
        });
      })
    );

    const playerIsWinner = cpuHandStrength.every(
      (cpuPlay: Player) =>
        playerHandStrength.handStrength.value >= cpuPlay.handStrength.value
    );

    const playerIsLoser = cpuHandStrength.some(
      (cpuPlay) =>
        playerHandStrength.handStrength.value < cpuPlay.handStrength.value
    );

    const playerIsTied =
      playerIsWinner &&
      cpuHandStrength.some(
        (cpuPlay) =>
          playerHandStrength.handStrength.value === cpuPlay.handStrength.value
      );

    console.log("GETTING RESULT");
    console.log("W", playerIsWinner, "L", playerIsLoser, "T", playerIsTied);
    if (playerIsWinner) {
      setResult({
        winner: "mainPlayer",
        play: playerHandStrength.handStrength.name,
      });
    } else if (playerIsLoser) {
      const cpuWithHighestPlay = cpuHandStrength.reduce((acc, cpuPlay) => {
        if (cpuPlay.handStrength.value > acc.handStrength.value) {
          return cpuPlay;
        }
        return acc;
      }, cpuHandStrength[0]);

      const isTie = cpuHandStrength.some(
        (cpuPlay) =>
          cpuPlay.handStrength.value === cpuWithHighestPlay.handStrength.value
      );

      if (isTie) {
        const tieCpuIds = cpuHandStrength.reduce((acc, cpuPlay) => {
          if (
            cpuPlay.handStrength.value === cpuWithHighestPlay.handStrength.value
          ) {
            acc.push(cpuPlay.id);
          }
          return acc;
        }, []);

        setResult({
          winner: "Tie",
          play: cpuWithHighestPlay.handStrength.name,
          splitBetween: [...tieCpuIds],
        });
      }

      setResult({
        winner: cpuWithHighestPlay.id,
        play: cpuWithHighestPlay.handStrength.name,
      });
    } else if (playerIsTied) {
      const tieCpuIds = cpuHandStrength.reduce((acc, cpuPlay) => {
        if (
          cpuPlay.handStrength.value === playerHandStrength.handStrength.value
        ) {
          acc.push(cpuPlay.id);
        }
        return acc;
      }, []);

      setResult({
        winner: "Tie",
        play: playerHandStrength.handStrength.name,
        splitBetween: [...tieCpuIds, "mainPlayer"],
      });

      setGameStarted(false);
    }
  };

  const clearGameRound = () => {
    setGameRound(0);
    setCurrentBet(0);
    setPot(0);
    setResult(null);

    setBettingOrder(-1);
  };

  const startNewGameRound = () => {
    resetPlayersRound();
    setTable([]);
    setResult(null);

    setGameRound(0);
    setCurrentBet(0);
    setPot(0);
    handleAdvanceGameRound();
  };

  /**
   * Rotate players in the betting order (small and big blind)
   *
   * @returns void
   */
  const rotatePlayers = () => {
    resetPlayersRound();
    console.log("ROTATING PLAYERS");
    const updatedBettingOrder = gameStore.getState().bettingOrderSequence;

    const lastBigBlind = updatedBettingOrder[0];

    const newBettingOrderSequence = produce(updatedBettingOrder, (draft) => {
      draft.shift();
      draft.push(lastBigBlind);
    });

    console.log("newBettingOrderSequence", newBettingOrderSequence);

    setBettingOrderSequence(newBettingOrderSequence);
    setRoundOrderSequence(newBettingOrderSequence);

    newBettingOrderSequence.forEach((playerId, i) => {
      if (i === 0) {
        setAsSmallBlind(playerId);
      }

      if (i === 1) {
        setAsBigBlind(playerId);
      }
    });
  };

  const handleAdvanceGameRound = async () => {
    if (!gameStarted) {
      const { cpus: localCPUS, mainPlayer: localPlayer } = await initPlayers();
      setBettingOrderSequence(["mainPlayer", ...Object.keys(localCPUS)]);
      setRoundOrderSequence(["mainPlayer", ...Object.keys(localCPUS)]);
      await dealCards();

      setBettingOrder(0);

      setGameRound(0);
      setGameStarted(true);

      return;
    }

    const updatedGameRound = gameStore.getState().gameRound;
    const updatedBettingOrder = gameStore.getState().bettingOrder;
    const roundOrder = gameStore.getState().roundOrderSequence;
    const updatedPot = gameStore.getState().pot;

    // if (updatedBettingOrder === 0 && updatedBettingOrder[0] !== "mainPlayer") {
    //   dealCards();
    // }

    if (updatedGameRound === 3) {
      if (!!gameStore.getState().result?.winner) {
        console.log("ROUND ENDED");
        clearGameRound();
        dealCards();
        return;
      }
      console.log("GETTING WINNER");

      getWinner();
      // setGameStarted(false);

      rotatePlayers();

      const result = gameStore.getState().result;

      if (result?.winner === "Tie") {
        result.splitBetween.forEach((playerId) => {
          addMoneyToPlayer(playerId, updatedPot / result.splitBetween.length);
        });
      } else {
        addMoneyToPlayer(result.winner, updatedPot);
      }
      return;
    }

    if (roundOrder.length === 1) {
      rotatePlayers();

      addMoneyToPlayer(roundOrder[0], updatedPot);
      clearGameRound();
      dealCards();

      return;
    }
    if (updatedBettingOrder === roundOrder.length - 1) {
      console.log("ADVANCE GAME ROUND");
      setGameRound(updatedGameRound + 1);

      setBettingOrder(-1);
      setCurrentBet(0);
      resetPlayersStatus();

      handleGetTableStatistics();
    }
    handleAdvanceBettingRound();
  };

  const handleAdvanceBettingRound = async () => {
    const updatedBettingOrder = gameStore.getState().bettingOrder;
    const updatedBettingOrderSequence =
      gameStore.getState().bettingOrderSequence;
    const updatedRoundSequence = gameStore.getState().roundOrderSequence;

    const currentPlayerTurn = updatedRoundSequence
      ? updatedRoundSequence[updatedBettingOrder + 1]
      : updatedBettingOrderSequence[updatedBettingOrder + 1];

    setBettingOrder(updatedBettingOrder + 1);

    setPlayerTurn(currentPlayerTurn);

    console.log(
      "CURRENT PLAYER TURN",
      currentPlayerTurn,
      updatedRoundSequence,
      updatedBettingOrder + 1
    );

    if (currentPlayerTurn !== "mainPlayer") {
      const { cpu: bettedCpu, pot: newPot } =
        cpuSimulation.handleSimulateCpuTurn(currentPlayerTurn);

      console.log(bettedCpu, newPot);
      setPot(newPot);

      const allCpus = playerStore.getState().cpus;

      const updatedCpus = produce(allCpus, (draft) => {
        draft[bettedCpu.id] = bettedCpu;
      });

      setCpus(updatedCpus);

      if (bettedCpu.status === "RAISE") {
        // new raise sequence
        // starts with the next player after the raiser

        const raiserIndex = updatedBettingOrderSequence.findIndex(
          (playerId) => playerId === bettedCpu.id
        );

        const replica = [...updatedBettingOrderSequence];

        const newRaiseSequence = replica
          .splice(raiserIndex + 1)
          .concat(replica.splice(0, raiserIndex));

        setRoundOrderSequence(newRaiseSequence);

        setBettingOrder(-1);

        if (currentPlayerTurn !== "mainPlayer") {
          setPlayer({
            ...mainPlayer,
            hasBetted: false,
            isTurn: false,
            status: null,
          });
        }

        const reupdatedCpus = produce(updatedCpus, (draft) => {
          Object.values(draft).forEach((cpu) => {
            if (cpu.id !== currentPlayerTurn) {
              draft[cpu.id].hasBetted = false;
              draft[cpu.id].isTurn = false;

              if (draft[cpu.id].status !== "FOLD") {
                draft[cpu.id].status = null;
              }
            }
          });
        });

        setCpus(reupdatedCpus);
      } else if (bettedCpu.status === "FOLD") {
        setRoundOrderSequence(
          updatedRoundSequence.filter((playerId) => playerId !== bettedCpu.id)
        );
        setBettingOrder(updatedBettingOrder);
      }

      // Now, the state should be updated, and you can continue with other logic.
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await handleAdvanceGameRound();
    }
  };

  const handlePlayerRaise = () => {
    const updatedBettingOrderSequence =
      gameStore.getState().bettingOrderSequence;

    // new raise sequence
    // starts with the next player after the raiser

    const raiserIndex = updatedBettingOrderSequence.findIndex(
      (playerId) => playerId === "mainPlayer"
    );

    const replica = [...updatedBettingOrderSequence];

    const newRaiseSequence = replica
      .splice(raiserIndex)
      .concat(replica.splice(0, raiserIndex));

    setRoundOrderSequence(newRaiseSequence);

    setBettingOrder(0);

    const reupdatedCpus = produce(playerStore.getState().cpus, (draft) => {
      Object.values(draft).forEach((cpu) => {
        draft[cpu.id].hasBetted = false;
        draft[cpu.id].isTurn = false;

        if (draft[cpu.id].status !== "FOLD") {
          draft[cpu.id].status = null;
        }
      });
    });

    setCpus(reupdatedCpus);
  };

  const handlePlayerFold = () => {
    const roundSequence = gameStore.getState().roundOrderSequence;
    const player = playerStore.getState().mainPlayer;
    const currentOrder = gameStore.getState().bettingOrder;

    setRoundOrderSequence(
      produce(roundSequence, (draft) => {
        draft.splice(draft.indexOf(player.id), 1);
      })
    );

    setPlayer({
      ...player,
      status: "FOLD",
    });

    setBettingOrder(currentOrder - 1);

    handleAdvanceGameRound();
  };

  const handlePlayerBet = (amount: number) => {
    const { pot } = gameStore.getState();
    const { mainPlayer } = playerStore.getState();

    setPlayer({
      ...mainPlayer,
      isTurn: false,
      bet: amount,
      money: mainPlayer.money - amount,
      blindCompleted: true,
    });

    setPot(pot + amount);
    setCurrentBet(amount);
    if (!mainPlayer.isSmallBlind && amount > pot) {
      handlePlayerRaise();
    }

    handleAdvanceGameRound();
  };

  return {
    resetGame,
    shuffleDeck,
    dealCards,
    getWinner,
    startNewGameRound,
    nextGameRound,
    resetGameMoney,
    resetRound,
    handleAdvanceGameRound,
    handlePlayerRaise,
    handlePlayerFold,
    handlePlayerBet,
  };
}
