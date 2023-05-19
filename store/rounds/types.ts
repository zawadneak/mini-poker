export interface RoundStore {
  gameRound: number;
  setGameRound: (gameRound: number) => void;

  // total bets in the pot
  pot: number;
  setPot: (pot: number) => void;

  // bet to match
  currentBet: number;
  setCurrentBet: (currentBet: number) => void;

  // current hand betting round
  bettingRound: number;
  setBettingRound: (bettingRound: number) => void;

  // current player betting order
  bettingOrder: number;
  setBettingOrder: (bettingOrder: number) => void;

  playerMoney: number;
  setPlayerMoney: (playerMoney: number) => void;

  cpuMoney: number;
  setCpuMoney: (cpuMoney: number) => void;
}
