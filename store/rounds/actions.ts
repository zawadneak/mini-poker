import useGame from "../game";
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
  const { actions } = useGame();

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

  function willCPUMatchBet() {
    return Math.random() > 0.5;
  }

  function willCPURaise(): number | false {
    const raise = Math.random() > 0.5;

    const raiseAmmount = [5, 10, 50];
    if (raise) {
      return raiseAmmount[Math.floor(Math.random() * raiseAmmount.length)];
    }

    return false;
  }

  function handlePlayerBet(ammount: number) {
    if (playerMoney < ammount) {
      alert("You don't have enough money");
      return;
    }
    console.log("handlePlayerBet", ammount);

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
    if (willCPUMatchBet()) {
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
