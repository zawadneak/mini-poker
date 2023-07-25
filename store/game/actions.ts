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
  } = gameStore((state) => state);

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
      draft.filter((cpu) => {
        cpu.money > 0;
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

  const dealCards = async (cpus: Player[]) => {
    const localShuffledDeck = shuffleDeck();

    const tableCards = await assignCardsToPlayers(localShuffledDeck, cpus);
    console.log(tableCards);
    setTable(tableCards.splice(0, 5));
  };

  const getWinner = () => {
    if (!gameStarted) return;
    const playerHandStrength = {
      ...mainPlayer,
      hand: mainPlayer.hand.concat(table),
      handStrength: getHandStrength(mainPlayer.hand.concat(table)),
    };
    const cpuHandStrength: Player[] = produce(cpus, (draft) => {
      draft.forEach((cpu: Player) => {
        cpu.hand = cpu.hand.concat(table);
        cpu.handStrength = getHandStrength(cpu.hand);
      });
    });

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
    console.log("handleAdvanceGameRound");
    if (!gameStarted) {
      console.log("START NEW GAME ROUND");

      const { cpus: localCPUS } = await initPlayers();
      setBettingOrderSequence([
        "mainPlayer",
        ...localCPUS.map((cpu) => cpu.id),
      ]);
      await dealCards(localCPUS);

      setBettingOrder(0);

      setGameRound(0);
      setGameStarted(true);
      console.log(gameStore.getState(), playerStore.getState());

      return;
    }

    if (gameRound === 3) {
      getWinner();
      setGameStarted(false);
      return;
    }

    console.log("ADVANCE BETTING ROUND");

    if (bettingOrder === CPU_COUNT + 1) {
      setGameRound(gameRound + 1);
      setBettingOrder(0);
      setCurrentBet(0);
      resetPlayersRound();

      rotatePlayers();
    } else {
      handleAdvanceBettingRound();
    }
  };

  const handleAdvanceBettingRound = () => {
    const currentPlayerTurn = bettingOrderSequence[bettingOrder + 1];
    setBettingOrder(bettingOrder + 1);
    setPlayerTurn(currentPlayerTurn);

    if (currentPlayerTurn !== "mainPlayer") {
      cpuSimulation.handleSimulateCpuTurn(currentPlayerTurn);
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
