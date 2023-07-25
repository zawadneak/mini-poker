import useGameStore from "../../game/store";
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
import usePlayerStore from "../store";
import { Player } from "../types";

export default function useCPUSimulation() {
  const { cpus, setCpus } = usePlayerStore();

  const {
    table,
    gameRound,
    setPot,
    pot,

    currentBet,
  } = useGameStore();

  function getCPUResponseToBet(cpu: Player) {
    const tableHandByRound = table.slice(0, gameRound + 1);
    const hand = [...cpu.hand, ...tableHandByRound];
    const { value } = getHandStrength(hand);

    const bluff = Math.random() > BLUFF_CHANCE * DIFFICULTY;
    const raise = RAISE_AMOUNT[Math.floor(Math.random() * RAISE_AMOUNT.length)];

    const betToMatch = currentBet - cpu.bet;

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

  const handleSimulateCpuTurn = (cpuId: string) => {
    console.log("handleSimulateCpuTurn");
    const cpu = cpus[cpuId];

    const cpuResponse = getCPUResponseToBet(cpu);

    const betAmmount = currentBet - cpu.bet;

    if (cpu.money < betAmmount) {
      cpus[cpuId] = {
        ...cpu,
        status: "FOLD",
      };

      setCpus(cpus);
      return;
    }

    if (cpuResponse.match) {
      if (cpu.money < betAmmount) {
        // TODO: ajustar para que não seja injusto com quem deu raise
        setPot(pot + cpu.money + betAmmount);

        return;
      }

      setPot(pot + 2 * betAmmount);

      cpu[cpuId] = {
        ...cpu,
        status: "MATCH",
        money: cpu.money - betAmmount,
      };

      setCpus(cpus);
    } else {
      cpus[cpuId] = {
        ...cpu,
        status: "FOLD",
      };

      setCpus(cpus);
    }
    // else if (cpuResponse.raise !== 0) {
    //   if (cpuResponse.raise > betAmmount) {
    //     cpuResponse.raise = betAmmount;
    //   }

    //   resetPlayersHasBetted();

    //   setCurrentBet(cpuResponse.raise);
    //   setPot(pot + ammount + cpuResponse.raise);
    //   setCpu({
    //     ...cpu,
    //     status: "RAISE",
    //     money: cpuMoney - ammount - cpuResponse.raise,
    //   });
    // }
  };

  return {
    handleSimulateCpuTurn,
  };
}
