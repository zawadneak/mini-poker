import useGameStore, { gameStore } from "../../game/store";
import {
  BLUFF_CHANCE,
  DIFFICULTY,
  PAIR,
  RAISE_AMOUNT,
  STRAIGHT,
  THREE_OF_A_KIND,
  TWO_PAIR,
} from "../../poker/constants";
import getHandStrength from "../../poker/handCheck";
import usePlayerStore, { playerStore } from "../store";
import { Player } from "../types";

export default function useCPUSimulation() {
  const { setCurrentBet } = useGameStore();

  function getCPUResponseToBet(cpu: Player) {
    const {
      gameRound,
      currentBet,

      pot,
      table,
    } = gameStore.getState();

    const tableHandByRound = table.slice(0, gameRound + 1);
    const hand = [...cpu.hand, ...tableHandByRound];
    const { value } = getHandStrength(hand);

    const bluff = Math.random() > BLUFF_CHANCE * DIFFICULTY;
    const raise = RAISE_AMOUNT[Math.floor(Math.random() * RAISE_AMOUNT.length)];

    const betToMatch = currentBet - cpu.bet;

    // TODO: adjust
    // if (betToMatch === 0 && DIFFICULTY === 3) {
    //   return {
    //     match: false,
    //     raise: raise,
    //   };
    // }

    const matchByGameRound = [
      betToMatch <= 5,
      betToMatch < 10 && value >= PAIR,
      betToMatch < 50 && value >= TWO_PAIR,
      betToMatch < 50 && value >= THREE_OF_A_KIND,
    ];

    // TODO: adjust;
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

  const handleSimulateCpuTurn = (
    cpuId: string
  ): {
    cpu: Player;
    pot: number;
  } => {
    const cpus = playerStore.getState().cpus;
    const currentBet = gameStore.getState().currentBet;
    const pot = gameStore.getState().pot;

    let cpu = cpus[cpuId];

    const cpuResponse = getCPUResponseToBet(cpu);

    const betAmmount = currentBet - cpu.bet;

    console.log(cpuResponse);

    if (cpu.money < betAmmount) {
      // console.log("FOLD");
      cpu = {
        ...cpu,
        hasBetted: true,
        isTurn: false,
        status: "FOLD",
      };

      // console.log(cpu);

      return {
        cpu,
        pot,
      };
    }

    // console.log(cpuResponse);

    console.log(cpu.money, betAmmount);
    if (cpuResponse.match) {
      // console.log("MATCH");
      if (cpu.money < betAmmount) {
        // TODO: ajustar para que não seja injusto com quem deu raise

        return {
          cpu: {
            ...cpu,
            money: 0,
            bet: cpu.money + betAmmount,
            hasBetted: true,
            isTurn: false,
            status: "MATCH",
          },
          pot: pot + cpu.money + betAmmount,
        };
      }

      cpu = {
        ...cpu,
        bet: betAmmount,
        hasBetted: true,
        isTurn: false,
        status: "MATCH",
        money: cpu.money - betAmmount,
      };
      return {
        cpu: cpu,
        pot: pot + betAmmount,
      };
    } else if (cpuResponse.raise !== 0) {
      if (cpuResponse.raise > cpu.money) {
        cpuResponse.raise = cpu.money;
      }

      cpu = {
        ...cpu,
        status: "RAISE",
        bet: currentBet + cpuResponse.raise,
        hasBetted: true,
        isTurn: false,
        money: cpu.money - betAmmount - cpuResponse.raise,
      };

      setCurrentBet(currentBet + cpuResponse.raise);
      return {
        cpu,
        pot: pot + currentBet + cpuResponse.raise,
      };
    }
  };

  return {
    handleSimulateCpuTurn,
  };
}
