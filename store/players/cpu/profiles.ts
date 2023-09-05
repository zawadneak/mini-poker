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

const avatars = [
  "man1",
  "man2",
  "man3",
  "man4",
  "man5",
  "woman1",
  "woman2",
  "woman3",
  "woman4",
  "woman4",
  "woman5",
];
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
};

const CHARACTERS = [
  {
    name: "Carlos",
    avatar: "man1",
    profile: PROFILES.Conservative,
  },
  {
    name: "Miguel",
    avatar: "man2",
    profile: PROFILES.Aggressive,
  },
  {
    name: "Nick",
    avatar: "man3",
    profile: PROFILES.Bluffer,
  },
  {
    name: "John",
    avatar: "man4",
    profile: PROFILES.Aggressive,
  },
  {
    name: "Peter",
    avatar: "man5",
    profile: PROFILES.Conservative,
  },
  {
    name: "Sara",
    avatar: "woman1",
    profile: PROFILES.Conservative,
  },
  {
    name: "Maria",
    avatar: "woman2",
    profile: PROFILES.Conservative,
  },
  {
    name: "Linda",
    avatar: "woman3",
    profile: PROFILES.Bluffer,
  },
  {
    name: "Sofia",
    avatar: "woman4",
    profile: PROFILES.Aggressive,
  },
  {
    name: "Anna",
    avatar: "woman5",
    profile: PROFILES.Conservative,
  },
];

export default PROFILES;

export { CHARACTERS };
