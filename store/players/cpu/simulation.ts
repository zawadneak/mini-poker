import useGameStore, { gameStore } from "../../game/store";
import BASE_DECK, {
  BIG_BLIND_BET,
  STARTING_HANDS,
} from "../../poker/constants";
import getHandStrength from "../../poker/handCheck";
import usePlayerStore, { playerStore } from "../store";
import { PlayStatics, Player } from "../types";
import { Profile } from "./profiles";

export default function useCPUSimulation() {
  const { setCurrentBet, setRaiseCount, raiseCount } = useGameStore();
  const { setTableStandardDeviation, setTableVariance, setPlayStatistics } =
    usePlayerStore();

  function getTableByGameRound() {
    const { table, gameRound } = gameStore.getState();

    if (gameRound === 0) {
      return [];
    }
    if (gameRound === 1) {
      return table.slice(0, 3);
    }
    return table.slice(0, gameRound + 2);
  }

  function possibleHandsInTable(table: Card[]): {
    cards: Card[];
    score: number;
  }[] {
    const gameRound = gameStore.getState().gameRound;
    const deck = BASE_DECK;

    const tableCards = getTableByGameRound();
    const deckWithoutTableCards = deck.filter(
      (card) => !tableCards.some((tableCard) => tableCard.id === card.id)
    );

    const possibleTables = [];

    if (gameRound === 1) {
      for (let i = 0; i < deckWithoutTableCards.length; i++) {
        for (let j = i + 1; j < deckWithoutTableCards.length; j++) {
          const hand = [deckWithoutTableCards[i], deckWithoutTableCards[j]];
          const fullHand = [...hand, ...table];

          const fullHandStrength = getHandStrength(fullHand);

          possibleTables.push({
            cards: fullHand,
            score: fullHandStrength.value,
            name: fullHandStrength.name,
          });
        }
      }
    } else if (gameRound === 2) {
      for (let i = 0; i < deckWithoutTableCards.length; i++) {
        const hand = [deckWithoutTableCards[i]];
        const fullHand = [...hand, ...table];

        const fullHandStrength = getHandStrength(fullHand);

        possibleTables.push({
          cards: fullHand,
          score: fullHandStrength.value,
          name: fullHandStrength.name,
        });
      }
    } else {
      return [
        {
          cards: table,
          score: getHandStrength(table).value,
        },
      ];
    }

    possibleTables.sort((a, b) => b.score - a.score);

    console.log("possibleTables", possibleTables);

    return possibleTables;
  }

  function possibleHandTurnouts(
    possibleTables: {
      cards: Card[];
      score: number;
    }[],
    hand
  ): PlayStatics {
    let tournouts = [];

    for (let pt of possibleTables) {
      const localHand = [...hand, ...pt.cards];
      const localHandStrength = getHandStrength(localHand);

      const handExists = tournouts.findIndex(
        (h) => h.score === localHandStrength.value
      );

      if (handExists > -1) {
        tournouts[handExists].chance += 1;
      } else {
        tournouts.push({
          cards: [...pt.cards, ...hand],
          score: localHandStrength.value,
          name: localHandStrength.name,
          chance: 1,
        });
      }
    }

    tournouts.sort((a, b) => b.score - a.score);
    tournouts.map(
      (t) => (t.chancePercent = (t.chance / possibleTables.length) * 100)
    );

    console.log("tournouts", tournouts);

    const tournoutsVariance = tournouts.map((t) => t.chancePercent);
    const tournoutsVarianceSum = tournouts
      .map((t) => t.chancePercent)
      .reduce((a, b) => a + b, 0);
    const tournoutsVarianceAverage = tournoutsVarianceSum / tournouts.length;
    const tournoutsVarianceSumOfSquares = tournoutsVariance.reduce(
      (a, b) => a + Math.pow(b - tournoutsVarianceAverage, 2),
      0
    );
    const tournoutsVarianceStandardDeviation = Math.sqrt(
      tournoutsVarianceSumOfSquares / tournouts.length
    );

    // repeat score by number of chance
    let scores = [];
    tournouts.map((t) => {
      for (let i = 0; i < t.chance; i++) {
        scores.push(t.score);
      }
    });

    const scoresVariance = scores;
    const scoresVarianceSum = scores.reduce((a, b) => a + b, 0);
    const scoresVarianceAverage = scoresVarianceSum / scores.length;
    const scoresVarianceSumOfSquares = scoresVariance.reduce(
      (a, b) => a + Math.pow(b - scoresVarianceAverage, 2),
      0
    );
    const scoresVarianceStandardDeviation = Math.sqrt(
      scoresVarianceSumOfSquares / scores.length
    );

    console.log(
      "tournoutsVarianceStandardDeviation",
      tournoutsVarianceStandardDeviation,
      "tournoutsVarianceAverage",
      tournoutsVarianceAverage,
      "scoresVarianceStandardDeviation",
      scoresVarianceStandardDeviation,
      "scoresVarianceAverage",
      scoresVarianceAverage
    );

    return {
      tournouts,
      tournoutsVarianceStandardDeviation,
      tournoutsVarianceAverage,
      scoresVarianceStandardDeviation,
      scoresVarianceAverage,
    };
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
    const tableHandByRound = getTableByGameRound();
    const { tableVariance } = playerStore.getState();
    const raises = [Math.ceil(0.25 * pot), Math.ceil(0.5 * pot), pot];

    const hand = [...cpu.hand, ...tableHandByRound];

    const betToMatch = currentBet - cpu.bet;

    console.log("SIMULATION BET TO MATCH", betToMatch, currentBet, cpu.bet);

    let isGoodHand = false;
    let isBadHand = false;
    let raisePercent = 0;

    if (gameRound === 0) {
      const handString = hand
        .map((card) => (card.rank === "10" ? "T" : card.rank))
        .join("");

      const handPosition = STARTING_HANDS.findIndex(
        (startingHand) => startingHand.hand === handString
      );

      isGoodHand = handPosition < cpu.profile.goodHandPreFlop;
      isBadHand = handPosition > cpu.profile.badHandPreFlop;
    } else {
      let playerHandRank = playerStore
        .getState()
        .playStatistics.findIndex((p) => p.player === cpu.id);

      if (playerHandRank > -1) {
        const statistics =
          playerStore.getState().playStatistics[playerHandRank];

        const fromTableDifference =
          statistics.scoresVarianceAverage - tableVariance;
        const fromTableDifferencePercentage =
          (fromTableDifference * 100) / tableVariance || 0.001;

        console.log(fromTableDifferencePercentage);

        isBadHand = cpu.profile.badHandRank >= fromTableDifferencePercentage;
        isGoodHand = cpu.profile.goodHandRank <= fromTableDifferencePercentage;

        const raiseCapIndex =
          fromTableDifferencePercentage > 10
            ? 0
            : fromTableDifferencePercentage > 30
            ? 2
            : fromTableDifferencePercentage > 50
            ? 2
            : 0;

        raisePercent = cpu.profile.raiseCap[raiseCapIndex];
      } else {
        isBadHand = false;
        isGoodHand = false;
      }
    }

    // IF NEEDS TO MATCH A RAISE OR BET
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
      if (
        isGoodHand &&
        betToMatch < 0.5 * pot &&
        gameRound !== 0 &&
        raiseCount < 1
      ) {
        return {
          match: false,
          raise: Math.ceil(raisePercent * pot),
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
    if (isGoodHand && raiseCount < 1) {
      return {
        match: false,
        raise: Math.ceil(raisePercent * pot),
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
    const raiseCount = gameStore.getState().raiseCount;

    let cpu = cpus[cpuId];

    if (cpu.isBigBlind && !cpu.blindCompleted) {
      const betAmmount = cpu?.money < BIG_BLIND_BET ? cpu.money : BIG_BLIND_BET;

      cpu = {
        ...cpu,
        bet: betAmmount,
        money: cpu.money - betAmmount,
        blindCompleted: true,
        hasBetted: true,
        isTurn: false,
      };
      return {
        cpu,
        pot: pot + betAmmount,
      };
    }

    if (cpu.isSmallBlind && !cpu.blindCompleted) {
      const betAmmount = cpu?.money < BIG_BLIND_BET ? cpu.money : BIG_BLIND_BET;
      setCurrentBet(betAmmount);

      cpu = {
        ...cpu,
        bet: betAmmount,
        money: cpu.money - betAmmount,
        hasBetted: true,
        isTurn: false,
        blindCompleted: true,
      };
      return {
        cpu,
        pot: pot + betAmmount,
      };
    }

    const cpuResponse = getCPUResponseToBet(cpu);

    const betAmmount = currentBet - cpu.bet;

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

    if (cpuResponse.match || betAmmount >= pot / 2 || raiseCount >= 1) {
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

      const updatedRaiseCount = gameStore.getState().raiseCount + 1;

      cpu = {
        ...cpu,
        status: "RAISE",
        bet: currentBet + cpuResponse.raise,
        hasBetted: true,
        isTurn: false,
        money: cpu.money - betAmmount - cpuResponse.raise,
      };

      setCurrentBet(currentBet + cpuResponse.raise);
      setRaiseCount(updatedRaiseCount);
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

  const handleGetTableStatistics = () => {
    const bettingRounds = gameStore.getState().bettingOrder;
    const { mainPlayer } = playerStore.getState();
    const { shuffledDeck } = gameStore.getState();

    if (bettingRounds >= 0) {
      console.log("BETTING ROUNDS: ", bettingRounds);
      setTableStandardDeviation(0);
      setTableVariance(0);
      return;
    }

    const table = getTableByGameRound();

    const possibleTables = possibleHandsInTable(table);

    const activePlayers: Partial<Player>[] = Object.values(
      playerStore.getState().cpus
    ).filter((cpu) => cpu.status !== "FOLD");

    Object.values(new Array(50)).forEach((_, i) => {
      const randomHand = [
        shuffledDeck[Math.floor(Math.random() * shuffledDeck.length)],
        shuffledDeck[Math.floor(Math.random() * shuffledDeck.length)],
      ];

      activePlayers.push({
        id: `fake-${i}`,
        hand: randomHand,
      });
    });

    let playersStatistics = activePlayers.map((cpu) => {
      return {
        ...possibleHandTurnouts(possibleTables, cpu.hand),
        player: cpu.id,
      };
    });

    if (mainPlayer.status !== "FOLD") {
      playersStatistics.push({
        ...possibleHandTurnouts(possibleTables, mainPlayer.hand),
        player: mainPlayer.id,
      });
    }

    setPlayStatistics(playersStatistics);

    const totalVarianceAverage =
      playersStatistics.reduce(
        (acc, cpu) => acc + cpu.scoresVarianceAverage,
        0
      ) / playersStatistics.length;
    const totalStandardDeviationAverage =
      playersStatistics.reduce(
        (acc, cpu) => acc + cpu.scoresVarianceStandardDeviation,
        0
      ) / playersStatistics.length;

    console.log("TOTAL VARIANCE AVERAGE: ", totalVarianceAverage);
    console.log(
      "TOTAL STANDARD DEVIATION AVERAGE: ",
      totalStandardDeviationAverage
    );

    setTableVariance(totalVarianceAverage);
    setTableStandardDeviation(totalStandardDeviationAverage);
  };

  return {
    handleSimulateCpuTurn,
    handleGetTableStatistics,
  };
}
