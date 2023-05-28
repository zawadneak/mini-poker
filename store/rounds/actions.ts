import useGame from "../game";
import { BLUFF_CHANCE, PAIR, RAISE_AMOUNT, TWO_PAIR } from "../poker/constants";
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
    setBettingRound(0);
    setCurrentBet(0);

    if (gameRound === 3) {
      getWinner();
    } else {
      setGameRound(gameRound + 1);
    }
  }

  function willCPUMatchBet(betToMatch: number) {
    const tableHandByRound = table.slice(0, gameRound + 1);
    const hand = [...dealerHand, ...tableHandByRound];
    const { value } = getHandStrength(hand);

    const bluff = Math.random() > BLUFF_CHANCE;

    if (bluff) {
      return {
        match: true,
        raise: 0,
      };
    }

    switch (gameRound) {
      case 0:
        if (betToMatch <= 5 || value >= PAIR) {
          return {
            match: true,
            raise: 0,
          };
        }
        break;
      case 1:
        if ((betToMatch < 5 && value <= PAIR) || value >= PAIR) {
          return {
            match: true,
            raise: 0,
          };
        }
        break;
      case 2:
        if ((betToMatch < 50 && value < TWO_PAIR) || value >= TWO_PAIR) {
          const raiseAmount =
            RAISE_AMOUNT[Math.floor(Math.random() * RAISE_AMOUNT.length)];
          return {
            match: true,
            raise: raiseAmount,
          };
        }
        break;
      case 3:
        if (value >= TWO_PAIR) {
          const raiseAmount =
            RAISE_AMOUNT[Math.floor(Math.random() * RAISE_AMOUNT.length)];
          return {
            match: true,
            raise: raiseAmount,
          };
        }
        break;
    }

    return {
      match: false,
      raise: 0,
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

    const cpuResponse = willCPUMatchBet(ammount);

    if (cpuResponse.match) {
      alert("CPU MATCH");
      setPot(pot + ammount + cpuResponse.raise);
      setCpuMoney(cpuMoney - ammount - cpuResponse.raise);
      setPlayerMoney(playerMoney - ammount);
      nextGameRound();
    } else if (cpuResponse.raise !== 0) {
      alert("CPU RAISE " + cpuResponse.raise);
      setPot(pot + ammount + cpuResponse.raise);
      setCpuMoney(cpuMoney - ammount - cpuResponse.raise);
      setPlayerMoney(playerMoney - ammount);
      nextGameRound();
    } else {
      alert("CPU FOLD");
      setPlayerMoney(playerMoney + pot);
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
