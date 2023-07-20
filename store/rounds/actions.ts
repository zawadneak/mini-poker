import useGame from "../game";
import {
  BLUFF_CHANCE,
  DIFFICULTY,
  PAIR,
  RAISE_AMOUNT,
  STARTING_MONEY,
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

  const { resetGame, getWinner } = actions;

  function resetGameMoney() {
    setPot(0);
    setPlayerMoney(STARTING_MONEY);
    setCpuMoney(STARTING_MONEY);
  }

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

    const bluff = Math.random() > BLUFF_CHANCE * DIFFICULTY;
    const raise = RAISE_AMOUNT[Math.floor(Math.random() * RAISE_AMOUNT.length)];

    if (betToMatch === 0 && DIFFICULTY === 3) {
      return {
        match: false,
        raise: raise,
      };
    }

    const matchByGameRound = [
      betToMatch <= 5,
      betToMatch < 10 && value >= PAIR,
      betToMatch < 50 && value >= TWO_PAIR,
      betToMatch < 50 && value >= THREE_OF_A_KIND,
    ];

    const raiseByGameRound = [
      value >= PAIR,
      value >= TWO_PAIR,
      value >= THREE_OF_A_KIND,
      value >= STRAIGHT,
    ];

    return {
      match: matchByGameRound[gameRound] || betToMatch === 0,
      raise: raiseByGameRound[gameRound] || bluff ? raise + betToMatch : 0,
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

    if (cpuMoney < ammount) {
      setCpuResponse("FOLD");
      setPlayerMoney(playerMoney + pot);
      resetGame();
      return;
    }

    if (cpuResponse.match) {
      setCpuResponse("MATCH");
      if (cpuMoney < ammount) {
        setCurrentBet(cpuMoney);
        setPot(pot + cpuMoney * 2);
        setCpuMoney(0);
        setPlayerMoney(playerMoney - cpuMoney);
        return;
      }

      setPot(pot + 2 * ammount);
      setCpuMoney(cpuMoney - ammount);
      setPlayerMoney(playerMoney - ammount);
      nextGameRound();
    } else if (cpuResponse.raise !== 0) {
      if (cpuResponse.raise > cpuMoney) {
        cpuResponse.raise = cpuMoney;
      }

      setCpuResponse("RAISE");
      setCurrentBet(cpuResponse.raise);
      setPot(pot + ammount + cpuResponse.raise);
      setCpuMoney(cpuMoney - ammount - cpuResponse.raise);
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
    if (playerMoney < currentBet) {
      setCurrentBet(playerMoney);
      setPot(pot + playerMoney * 2);
      setCpuMoney(cpuMoney - playerMoney);
      setPlayerMoney(0);
      return nextGameRound();
    }

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
    resetGameMoney,
  };
}
