import { produce } from "immer";
import usePlayerStore from "../players/store";
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
import useGameStore from "./store";
import usePlayerActions from "../players/actions";
import { Player } from "../players/types";

export default function useGameActions() {
  const {
    gameStarted,
    setGameStarted,
    shuffledDeck,
    setShuffledDeck,
    setTable,
    setResult,

    playerHand,
    dealerHand,
    table,
  } = useGameStore();

  const { mainPlayer, cpus, setPlayer, setCpus } = usePlayerStore();

  const { assignCardsToPlayers, initPlayers } = usePlayerActions();

  const { pot } = useRoundStore();

  const resetGame = () => {
    initPlayers();
    setGameStarted(false);
    setTable([]);
    setResult(null);

    // if (playerMoney === 0 || cpuMoney === 0) {
    //   alert("Game Over");
    //   setPlayerMoney(STARTING_MONEY);
    //   setCpuMoney(STARTING_MONEY);
    // }
  };

  const shuffleDeck = () => {
    resetGame();

    let deck = [...BASE_DECK];

    for (let i = BASE_DECK.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setShuffledDeck(deck);
  };

  const dealCards = () => {
    shuffleDeck();
    setGameStarted(true);

    const tableCards = assignCardsToPlayers(shuffledDeck);
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
    initPlayers();
    setTable([]);
    setResult(null);

    shuffleDeck();
  };

  return {
    resetGame,
    shuffleDeck,
    dealCards,
    getWinner,
    startNewGameRound,
  };
}
