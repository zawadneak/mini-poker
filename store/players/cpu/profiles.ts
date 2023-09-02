export interface Profile {
  name: string;
  bluffPercentage: number;
  raisePercentage: number;

  // postflop
  // percentage treshold that defines good or bad hand
  badHandRank: number;
  goodHandRank: number;

  // preflop
  // pre flop hand raking that defines good or bad hand
  badHandPreFlop: number;
  goodHandPreFlop: number;

  // ordered raise caps considering the hand rank
  // 0=> small cap
  // 1=> medium cap
  // 2=> big cap
  raiseCap?: number[];
}

const PROFILES = {
  Bluffer: {
    name: "Bluffer",
    bluffPercentage: 0.5,
    raisePercentage: 0.3,
    badHandRank: -40,
    goodHandRank: -20,
    goodHandPreFlop: 60,
    badHandPreFlop: 80,

    raiseCap: [0.5, 0.5, 0.5],
  },
  Aggressive: {
    name: "Aggressive",
    bluffPercentage: 0.3,
    raisePercentage: 0.5,
    goodHandPreFlop: 70,
    badHandPreFlop: 120,
    badHandRank: -10,
    goodHandRank: 0,

    raiseCap: [0.25, 1, 2],
  },
  Conservative: {
    name: "Conservative",
    bluffPercentage: 0.1,
    raisePercentage: 0.1,
    badHandRank: -10,
    goodHandRank: 20,

    raiseCap: [0.25, 0.5, 1],

    goodHandPreFlop: 30,
    badHandPreFlop: 120,
  },
  // Random: {
  //   name: "Random",
  //   bluffPercentage: 0.5,
  //   raisePercentage: 0.5,
  //   badHandRank: 5,
  //   goodHandRank: 5,
  //   goodHandPreFlop: Math.random() * 100 + 1,
  //   badHandPreFlop: Math.random() * 100 + 1,
  // },
};

export default PROFILES;
