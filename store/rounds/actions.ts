import useGame from "../game";
import {
  BLUFF_CHANCE,
  PAIR,
  RAISE_AMOUNT,
  STRAIGHT,
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
    const raise = RAISE_AMOUNT[Math.floor(Math.random() * RAISE_AMOUNT.length)];

    if (bluff) {
      const bluffRaise = Math.random() > BLUFF_CHANCE;
      return {
        match: true,
        raise: bluffRaise ? raise + betToMatch : 0,
      };
    }

    const matchByGameRound = [
      betToMatch <= 5,
      betToMatch < 10 && value >= PAIR,
      betToMatch < 20 && value >= TWO_PAIR,
      betToMatch < 50 && value >= THREE_OF_A_KIND,
    ];

    const raiseByGameRound = [
      value >= PAIR && raise + betToMatch <= 100,
      value >= TWO_PAIR && raise + betToMatch <= 200,
      value >= THREE_OF_A_KIND && raise + betToMatch <= 500,
      value >= STRAIGHT && raise + betToMatch <= 1000,
    ];

    return {
      match: matchByGameRound[gameRound] || false,
      raise: raiseByGameRound[gameRound] ? raise + betToMatch : 0,
    };
  }

  function handlePlayerBet(ammount: number) {
    if (playerMoney < ammount) {
      alert("You don't have enough money");
      return;
    }

    setBettingOrder(bettingOrder + 1);
    setCurrentBet(ammount);

    const cpuResponse = getCPUResponseToBet(ammount);

    if (cpuResponse.match) {
      setCpuResponse("MATCH");
      setPot(pot + 2 * ammount);
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

  function handlePlayerContinue() {
    setCpuResponse("WAITING");
  }

  function handlePlayerMatch() {
    setPot(pot + currentBet);
    setPlayerMoney(playerMoney - currentBet);
    setCurrentBet(0);
    setCpuResponse("WAITING");
    nextGameRound();
  }

  function handlePlayerFold() {
    setCpuMoney(cpuMoney + pot);
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
    handlePlayerContinue,
  };
}
