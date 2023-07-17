import BASE_DECK from "../poker/constants";
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

export default function useGameActions() {
  const {
    gameStarted,
    setGameStarted,
    shuffledDeck,
    setShuffledDeck,
    setPlayerHand,
    setTable,
    setDealerHand,
    setResult,

    playerHand,
    dealerHand,
    table,
  } = useGameStore();

  const { setPlayerMoney, setCpuMoney, pot, playerMoney, cpuMoney } =
    useRoundStore();

  const resetGame = () => {
    setGameStarted(false);
    setPlayerHand([]);
    setDealerHand([]);
    setTable([]);
    setResult(null);
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
    setPlayerHand([shuffledDeck[0], shuffledDeck[2]]);
    setDealerHand([shuffledDeck[1], shuffledDeck[3]]);
    setTable(shuffledDeck.slice(4, 9));
  };

  const getWinner = () => {
    if (!gameStarted) return;
    const playerCards = playerHand.concat(table);
    const dealerCards = dealerHand.concat(table);

    const playerPlay = getHandStrength(playerCards);
    const dealerPlay = getHandStrength(dealerCards);

    if (playerPlay.value > dealerPlay.value) {
      setPlayerMoney(playerMoney + pot);
      setResult({ winner: "Jogador", play: playerPlay.name });
    } else if (playerPlay.value < dealerPlay.value) {
      setCpuMoney(pot + cpuMoney);
      setResult({ winner: "Dealer", play: dealerPlay.name });
    } else {
      setPlayerMoney(playerMoney + pot / 2);
      setCpuMoney(cpuMoney + pot / 2);
      setResult({ winner: "Tie", play: playerPlay.name });
    }

    setGameStarted(false);
  };

  const startNewGameRound = () => {
    setPlayerHand([]);
    setDealerHand([]);
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
