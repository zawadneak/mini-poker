import useGameStore, { gameStore } from "../../game/store";
import { BIG_BLIND_BET } from "../../poker/constants";
import getHandStrength from "../../poker/handCheck";
import usePlayerStore, { playerStore } from "../store";
import { Player } from "../types";
import { Profile } from "./profiles";

export default function useCPUSimulation() {
  const { setCurrentBet } = useGameStore();

  // Generate all possible combinations of k elements from an array
  function generateCombinations<T>(arr: T[], k: number): T[][] {
    const result: T[][] = [];

    function backtrack(start: number, currentCombination: T[]) {
      if (currentCombination.length === k) {
        result.push([...currentCombination]);
        return;
      }

      for (let i = start; i < arr.length; i++) {
        currentCombination.push(arr[i]);
        backtrack(i + 1, currentCombination);
        currentCombination.pop();
      }
    }

    backtrack(0, []);
    return result;
  }

  function possibleHandsInTable(table: Card[]): {
    cards: Card[];
    score: number;
  }[] {
    const allCards = [...table]; // Combine table cards with player's cards if needed
    const hands: {
      cards: Card[];
      score: number;
    }[] = [];

    // Generate all possible combinations of 5-card hands from the table and player's cards
    const combinations = generateCombinations(allCards, 5);

    for (const combination of combinations) {
      const handScore = getHandStrength(combination); // Implement your hand evaluation logic here
      hands.push({ cards: combination, score: handScore.value });
    }

    // Sort hands by score in descending order
    hands.sort((a, b) => b.score - a.score);

    // Return the top 20 hands
    return hands.slice(0, 20);
  }

  function rankPlayerHandInPossibleHands(
    handValue: number,
    possibleHands: Card[][]
  ) {
    return 1;
  }

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

    // const bluff = Math.random() > cpu.profile.bluffPercentage;
    // const raise = bluff && Math.random() > cpu.profile.raisePercentage;

    const betToMatch = currentBet - cpu.bet;

    const betToMatchPercentage = betToMatch / pot || 0.01;

    const tableInCurrentRound = table.slice(0, gameRound + 1);

    const possibleHands = possibleHandsInTable(tableInCurrentRound);

    console.log(possibleHands);

    const playerHandRank = 20;

    const isBadHand = playerHandRank < cpu.profile.badHandRank;
    const isGoodHand = playerHandRank > cpu.profile.goodHandRank;

    // IF NEEDS TO MATCH A RAISE
    if (betToMatch > 0) {
      // IF THE HAND IS BAD = FOLD
      if (isBadHand) {
        return {
          match: false,
          raise: 0,
        };
      }

      // IF THE HAND IS GOOD = RAISE
      // TODO: adjust raise
      if (isGoodHand) {
        return {
          match: false,
          raise: 10,
        };
      }

      // IF THE HAND IS OK = MATCH
      return {
        match: true,
        raise: 0,
      };
    }

    // IF NO NEED TO MATCH A RAISE
    // IF THE HAND IS GOOD = RAISE
    if (isGoodHand) {
      return {
        match: true,
        raise: 10,
      };
    }

    // IF THE HAND IS OK/BAD = MATCH
    return {
      match: true,
      raise: 0,
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

    if (cpu.isBigBlind && !cpu.blindCompleted) {
      cpu = {
        ...cpu,
        bet: BIG_BLIND_BET,
        money: cpu.money - BIG_BLIND_BET,
        blindCompleted: true,
        hasBetted: true,
        isTurn: false,
      };
      return {
        cpu,
        pot: pot + BIG_BLIND_BET,
      };
    }

    // TODO: rotate the blinds
    if (cpu.isSmallBlind && !cpu.blindCompleted) {
      cpu = {
        ...cpu,
        bet: BIG_BLIND_BET,
        money: cpu.money - BIG_BLIND_BET,
        hasBetted: true,
        isTurn: false,
        blindCompleted: true,
      };
      return {
        cpu,
        pot: pot + BIG_BLIND_BET,
      };
    }

    const cpuResponse = getCPUResponseToBet(cpu);

    const betAmmount = currentBet - cpu.bet;

    console.log("BET AMMOUNT: ", betAmmount);

    if (cpu.money < betAmmount) {
      cpu = {
        ...cpu,
        hasBetted: true,
        isTurn: false,
        status: "FOLD",
      };
      return {
        cpu,
        pot,
      };
    }

    if (cpuResponse.match) {
      // console.log("MATCH");
      if (cpu.money < betAmmount) {
        // TODO: ajustar para que não seja injusto com quem deu raise

        return {
          cpu: {
            ...cpu,
            money: 0,
            bet: cpu.money,
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
      if (cpuResponse.raise + betAmmount > cpu.money) {
        cpuResponse.raise = cpu.money - betAmmount;
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
    } else {
      return {
        cpu: {
          ...cpu,
          status: "FOLD",
          hasBetted: true,
          isTurn: false,
        },
        pot,
      };
    }
  };

  return {
    handleSimulateCpuTurn,
  };
}
