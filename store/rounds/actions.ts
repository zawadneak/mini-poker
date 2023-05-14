import useRoundStore from "./store";

export default function useRoundActions() {
  const { setBettingRound, setGameRound, setCurrentBet, setPot, gameRound } =
    useRoundStore();

  function resetRound() {
    setBettingRound(0);
    setGameRound(0);
    setCurrentBet(0);
    setPot(0);
  }

  function nextGameRound() {
    setGameRound(gameRound + 1);
    setBettingRound(0);
    setCurrentBet(0);
  }

  return {
    resetRound,
    nextGameRound,
  };
}
