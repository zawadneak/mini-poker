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
}

const PROFILES = {
  Bluffer: {
    name: "Bluffer",
    bluffPercentage: 0.5,
    raisePercentage: 0.3,
    badRandRank: -50,
    goodHandRank: 10,
    goodHandPreFlop: 60,
    badHandPreFlop: 80,
  },
  Agreesive: {
    name: "Aggressive",
    bluffPercentage: 0.3,
    raisePercentage: 0.5,
    badRandRank: -30,
    goodHandRank: 0,
    goodHandPreFlop: 70,
    badHandPreFlop: 120,
  },
  Conservative: {
    name: "Conservative",
    bluffPercentage: 0.1,
    raisePercentage: 0.1,
    badRandRank: -10,
    goodHandRank: 40,

    goodHandPreFlop: 30,
    badHandPreFlop: 120,
  },
  Random: {
    name: "Random",
    bluffPercentage: 0.5,
    raisePercentage: 0.5,
    badRandRank: 5,
    goodHandRank: 5,
    goodHandPreFlop: Math.random() * 100 + 1,
    badHandPreFlop: Math.random() * 100 + 1,
  },
};

export default PROFILES;
