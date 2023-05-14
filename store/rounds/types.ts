export interface RoundStore {
  gameRound: number;
  setGameRound: (gameRound: number) => void;

  pot: number;
  setPot: (pot: number) => void;

  currentBet: number;
  setCurrentBet: (currentBet: number) => void;

  bettingRound: number;
  setBettingRound: (bettingRound: number) => void;
}
