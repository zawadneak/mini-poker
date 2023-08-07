export interface Profile {
  name: string;
  bluffPercentage: number;
  raisePercentage: number;
  badHandRank: number;
  goodHandRank: number;
}

const PROFILES = {
  Bluffer: {
    name: "Bluffer",
    bluffPercentage: 0.7,
    raisePercentage: 0.3,
    badRandRank: 8,
    goodHandRank: 2,
  },
  Agreesive: {
    name: "Aggressive",
    bluffPercentage: 0.3,
    raisePercentage: 0.5,
    badRandRank: 8,
    goodHandRank: 8,
  },
  Conservative: {
    name: "Conservative",
    bluffPercentage: 0.1,
    raisePercentage: 0.1,
    badRandRank: 2,
    goodHandRank: 2,
  },
  Random: {
    name: "Random",
    bluffPercentage: 0.5,
    raisePercentage: 0.5,
    badRandRank: 5,
    goodHandRank: 5,
  },
};

export default PROFILES;
