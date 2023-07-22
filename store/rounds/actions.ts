import useGame from "../game";
import usePlayers from "../players";
import { Player } from "../players/types";
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
    setCpuResponse,
  } = useRoundStore();
  const { actions, store } = useGame();

  const { dealerHand, table } = store;

  const { resetGame, getWinner } = actions;

  const { actions: playerActions, store: playerStore } = usePlayers();

  const { setCpu, resetPlayersHasBetted } = playerActions;

  const { cpus, setPlayer, mainPlayer } = playerStore;

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

  function getCPUResponseToBet(betToMatch: number, cpu: Player) {
    const tableHandByRound = table.slice(0, gameRound + 1);
    const hand = [...cpu.hand, ...tableHandByRound];
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

    setPlayer({
      ...mainPlayer,
      money: playerMoney - ammount,
    });

    setBettingOrder(bettingOrder + 1);
    setCurrentBet(ammount);

    cpus.forEach((cpu) => {
      const cpuResponse = getCPUResponseToBet(ammount, cpu);
      if (cpuMoney < ammount) {
        setCpu({
          ...cpu,
          status: "FOLD",
        });
        return;
      }

      if (cpuResponse.match) {
        if (cpuMoney < ammount) {
          // TODO: ajustar para que não seja injusto com quem deu raise
          setPot(pot + cpuMoney + ammount);
          setCpu({
            ...cpu,
            status: "MATCH",
            money: 0,
          });
          return;
        }

        setPot(pot + 2 * ammount);
        setCpu({
          ...cpu,
          status: "MATCH",
          money: cpuMoney - ammount,
        });
      } else if (cpuResponse.raise !== 0) {
        if (cpuResponse.raise > cpuMoney) {
          cpuResponse.raise = cpuMoney;
        }

        resetPlayersHasBetted();

        setCurrentBet(cpuResponse.raise);
        setPot(pot + ammount + cpuResponse.raise);
        setCpu({
          ...cpu,
          status: "RAISE",
          money: cpuMoney - ammount - cpuResponse.raise,
        });
      }
    });
  }

  function handlePlayerContinue() {
    resetPlayersHasBetted();
  }

  function handlePlayerMatch() {
    if (playerMoney < currentBet) {
      // TODO: ajustar para que não seja injusto com quem deu raise
      setCurrentBet(playerMoney);
      setPot(pot + playerMoney * 2);
      setPlayerMoney(0);
      return resetPlayersHasBetted();
    }

    setPot(pot + currentBet);
    setPlayerMoney(playerMoney - currentBet);
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
