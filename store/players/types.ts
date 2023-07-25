export interface Player {
  id: string;
  name: string;
  hand: Card[];
  money: number;
  bet: number;
  hasBetted: boolean;
  status: "FOLD" | "MATCH" | "RAISE" | null;
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

  cpus: Map<string, Player>;
  setCpus: (cpus: Map<string, Player>) => void;
};

export { PlayerStore };
