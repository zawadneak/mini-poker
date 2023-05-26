import useGame from "../game";
import { BLUFF_CHANCE, PAIR, TWO_PAIR } from "../poker/constants";
import getHandStrength from "../poker/handCheck";
import useRoundStore from "./store";

export default function useRoundActions() {
  const {
    setBettingRound,
    setGameRound,
    setCurrentBet,
    setPot,
    gameRound,
    bettingOrder,
    currentBet,
    setBettingOrder,
    pot,
    bettingRound,
    playerMoney,
    cpuMoney,
    setPlayerMoney,
    setCpuMoney,
  } = useRoundStore();
  const { actions, store } = useGame();

  const { dealerHand, table } = store;

  const { shuffleDeck, resetGame, getWinner } = actions;
  function resetRound() {
    setBettingRound(0);
    setGameRound(0);
    setCurrentBet(0);
    setPot(0);
  }

  function nextGameRound() {
    setGameRound(gameRound + 1);
    setBettingRound(0);
    setCurrentBet(0);

    if (gameRound === 3) {
      getWinner();
    }
  }

  // TODO: raise bet
  function willCPUMatchBet(betToMatch: number) {
    const tableHandByRound = table.slice(0, gameRound + 1);

    const hand = [...dealerHand, ...tableHandByRound];

    const { value } = getHandStrength(hand);

    const bluff = Math.random() > BLUFF_CHANCE;

    if (bluff) return true;

    switch (gameRound) {
      case 0:
        return betToMatch <= 5 || value >= PAIR;
      case 1:
        return (betToMatch < 5 && value <= PAIR) || value >= PAIR;
      case 2:
        return (betToMatch < 50 && value < TWO_PAIR) || value >= TWO_PAIR;
      case 3:
        return value >= TWO_PAIR;
      default:
        return false;
    }
  }

  function handlePlayerBet(ammount: number) {
    if (playerMoney < ammount) {
      alert("You don't have enough money");
      return;
    }

    setBettingOrder(bettingOrder + 1);
    setPot(pot + ammount);
    setCurrentBet(ammount);

    // player check
    if (ammount === 0) {
      // const raise = willCPURaise();

      // if (raise) {
      //   setPot(pot + raise);
      //   setCurrentBet(raise);
      //   setBettingOrder(0);
      //   setBettingRound(bettingRound + 1);
      // }

      return nextGameRound();
    }
    if (willCPUMatchBet(ammount)) {
      alert("CPU MATCH");
      setPot(pot + ammount + ammount);
      setCpuMoney(cpuMoney - ammount);

      setPlayerMoney(playerMoney - ammount);
      nextGameRound();
    } else {
      alert("CPU FOLD");
      resetGame();
    }
  }

  function handlePlayerMatch() {
    setPot(pot + currentBet);
    setCurrentBet(0);
    nextGameRound();
  }

  function handlePlayerFold() {
    alert("PLAYER FOLD");
    resetGame();
  }

  return {
    resetGame,
    resetRound,
    nextGameRound,
    handlePlayerBet,
    handlePlayerMatch,
    handlePlayerFold,
  };
}
