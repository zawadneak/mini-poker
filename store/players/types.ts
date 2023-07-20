export interface Player {
  id: string;
  name: string;
  hand: Card[];
  money: number;
  bet: number;
  result: Result;
  isTurn: boolean;
  isWinner: boolean;
  isBigBlind: boolean;
  isSmallBlind: boolean;

  handStrength?: {
    name: string;
    value: number;
  };
}

type PlayerStore = {
  mainPlayer: Player | null;
  setPlayer: (player: Player) => void;

  cpus: Player[];
  setCpus: (cpus: Player[]) => void;
};

export { PlayerStore };
