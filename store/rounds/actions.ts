import useGame from "../game";
import {
  BLUFF_CHANCE,
  PAIR,
  RAISE_AMOUNT,
  THREE_OF_A_KIND,
  TWO_PAIR,
} from "../poker/constants";
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
    playerMoney,
    cpuMoney,
    setPlayerMoney,
    setCpuMoney,
    setRaiseToMatch,
    setCpuResponse,
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
    setBettingRound(0);
    setCurrentBet(0);

    if (gameRound === 3) {
      getWinner();
    } else {
      setGameRound(gameRound + 1);
    }
  }

  function getCPUResponseToBet(betToMatch: number) {
    const tableHandByRound = table.slice(0, gameRound + 1);
    const hand = [...dealerHand, ...tableHandByRound];
    const { value } = getHandStrength(hand);

    const bluff = Math.random() > BLUFF_CHANCE;

    const bluffRaise = Math.random() > BLUFF_CHANCE;

    const randomRaise =
      RAISE_AMOUNT[Math.floor(Math.random() * RAISE_AMOUNT.length)] +
      betToMatch;

    if (bluff)
      return {
        match: true,
        raise: bluffRaise ? randomRaise + betToMatch : 0,
      };

    const matchByGameRound = {
      0: betToMatch <= 5,
      1: betToMatch < 5 && value <= PAIR,
      2: betToMatch < 50 && value < TWO_PAIR,
      3: betToMatch < 10 && value >= TWO_PAIR,
    };

    const raiseByGameRound = {
      0: value >= PAIR,
      1: value >= TWO_PAIR,
      2: value >= TWO_PAIR,
      3: value >= THREE_OF_A_KIND,
    };

    return {
      match: matchByGameRound[gameRound] || false,
      raise: raiseByGameRound[gameRound] ? randomRaise : 0,
    };
  }

  function handlePlayerBet(ammount: number) {
    if (playerMoney < ammount) {
      alert("You don't have enough money");
      return;
    }

    setBettingOrder(bettingOrder + 1);
    setPot(pot + ammount);
    setCurrentBet(ammount);

    const cpuResponse = getCPUResponseToBet(ammount);

    if (cpuResponse.match) {
      setCpuResponse("WAITING");
      setPot(pot + ammount);
      setCpuMoney(cpuMoney - ammount);
      setPlayerMoney(playerMoney - ammount);
      nextGameRound();
    } else if (cpuResponse.raise !== 0) {
      setCpuResponse("RAISE");
      setCurrentBet(cpuResponse.raise);
      setPot(pot + ammount + cpuResponse.raise);
      setCpuMoney(cpuMoney - ammount - cpuResponse.raise);
      setPlayerMoney(playerMoney - ammount - cpuResponse.raise);
      nextGameRound();
    } else {
      setCpuResponse("FOLD");
      setPlayerMoney(playerMoney + pot);
      resetGame();
    }
  }

  function handlePlayerMatch() {
    setPot(pot + currentBet);
    setCurrentBet(0);
    setCpuResponse("WAITING");
    nextGameRound();
  }

  function handlePlayerFold() {
    alert("PLAYER FOLD");
    resetGame();
    setCpuResponse("WAITING");
    actions.startNewGameRound();
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
