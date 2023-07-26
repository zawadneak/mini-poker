import { produce } from "immer";
import usePlayerStore, { playerStore } from "../players/store";
import BASE_DECK, { STARTING_MONEY } from "../poker/constants";
import getHandStrength, {
  isFlush,
  isFourOfAKind,
  isFullHouse,
  isRoyalFlush,
  isStraight,
  isStraightFlush,
} from "../poker/handCheck";
import useRoundStore from "../rounds/store";
import useGameStore, { gameStore } from "./store";
import usePlayerActions from "../players/actions";
import { Player } from "../players/types";
import { CPU_COUNT } from "../players/constants";
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
    table,
  } = useGameStore();

  const { mainPlayer, cpus, setPlayer, setCpus } = usePlayerStore();

  const {
    assignCardsToPlayers,
    initPlayers,
    resetPlayersRound,
    setAsSmallBlind,
    setAsBigBlind,
    setPlayerTurn,
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

    const newCpus = produce(cpus, (draft) => {
      Object.values(cpus).map((cpu) => {
        if (cpu.money >= 0) {
          draft[cpu.id] = undefined;
        }
      });
    });

    setCpus(newCpus);
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

  const dealCards = async (cpus: { [key: string]: Player }, player: Player) => {
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
    const playerHandStrength = {
      ...mainPlayer,
      hand: mainPlayer.hand.concat(table),
      handStrength: getHandStrength(mainPlayer.hand.concat(table)),
    };
    const cpuHandStrength: Player[] = Object.values(
      produce(cpus, (draft) => {
        Object.values(cpus).forEach((cpu: Player) => {
          draft[cpu.id].hand = draft[cpu.id].hand.concat(table);
          draft[cpu.id].handStrength = getHandStrength(draft[cpu.id].hand);
        });
      })
    );

    const playerIsWinner = cpuHandStrength.every(
      (cpuPlay: Player) =>
        playerHandStrength.handStrength >= cpuPlay.handStrength
    );

    const playerIsLoser = cpuHandStrength.every(
      (cpuPlay) => playerHandStrength.handStrength < cpuPlay.handStrength
    );

    const playerIsTied =
      playerIsWinner &&
      cpuHandStrength.some(
        (cpuPlay) => playerHandStrength.handStrength === cpuPlay.handStrength
      );

    if (playerIsWinner) {
      setResult({
        winner: mainPlayer.id,
        play: playerHandStrength.handStrength.name,
      });
    } else if (playerIsLoser) {
      const cpuWithHighestPlay = cpuHandStrength.reduce((acc, cpuPlay) => {
        if (cpuPlay.handStrength.value > acc.handStrength.value) {
          return cpuPlay;
        }
        return acc;
      }, cpuHandStrength[0]);

      setResult({
        winner: cpuWithHighestPlay.id,
        play: cpuWithHighestPlay.handStrength.name,
      });
    } else if (playerIsTied) {
      setResult({
        winner: "Tie",
        play: playerHandStrength.handStrength.name,
      });

      setGameStarted(false);
    }
  };

  const startNewGameRound = () => {
    resetPlayersRound();
    setTable([]);
    setResult(null);

    shuffleDeck();
  };

  /**
   * Rotate players in the betting order (small and big blind)
   *
   * @returns void
   */
  const rotatePlayers = () => {
    // console.log("ROTATING PLAYERS");
    const lastBigBlind = bettingOrderSequence[0];

    const newBettingOrderSequence = produce(bettingOrderSequence, (draft) => {
      draft.shift();
      draft.push(lastBigBlind);
    });

    setBettingOrderSequence(newBettingOrderSequence);

    bettingOrderSequence.forEach((playerId, i) => {
      if (i === 0) {
        setAsSmallBlind(playerId);
      }

      if (i === 1) {
        setAsBigBlind(playerId);
      }
    });
  };

  const handleAdvanceGameRound = async () => {
    // console.log("handleAdvanceGameRound");
    if (!gameStarted) {
      // console.log("START NEW GAME ROUND");

      const { cpus: localCPUS, mainPlayer: localPlayer } = await initPlayers();
      setBettingOrderSequence(["mainPlayer", ...Object.keys(localCPUS)]);
      await dealCards(localCPUS, localPlayer);

      setBettingOrder(0);

      setGameRound(0);
      setGameStarted(true);
      // console.log(gameStore.getState(), playerStore.getState());

      return;
    }

    const updatedGameRound = gameStore.getState().gameRound;
    const updatedBettingOrder = gameStore.getState().bettingOrder;

    if (updatedGameRound === 3) {
      getWinner();
      setGameStarted(false);
      return;
    }

    if (updatedBettingOrder + 1 === CPU_COUNT + 1) {
      setGameRound(updatedGameRound + 1);
      setBettingOrder(0);
      setCurrentBet(0);
      resetPlayersRound();

      rotatePlayers();
    } else {
      handleAdvanceBettingRound();
    }
  };

  const handleAdvanceBettingRound = async () => {
    const updatedBettingOrder = gameStore.getState().bettingOrder;
    const updatedBettingOrderSequence =
      gameStore.getState().bettingOrderSequence;

    const currentPlayerTurn =
      updatedBettingOrderSequence[updatedBettingOrder + 1];
    setBettingOrder(updatedBettingOrder + 1);

    setPlayerTurn(currentPlayerTurn);

    if (currentPlayerTurn !== "mainPlayer") {
      const { cpu: bettedCpu, pot: newPot } =
        cpuSimulation.handleSimulateCpuTurn(currentPlayerTurn);

      // console.log(bettedCpu, newPot);
      setPot(newPot);

      const allCpus = playerStore.getState().cpus;

      const updatedCpus = produce(allCpus, (draft) => {
        draft[bettedCpu.id] = bettedCpu;
      });

      setCpus(updatedCpus);

      // Now, the state should be updated, and you can continue with other logic.
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await handleAdvanceGameRound();
    }
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
  };
}
