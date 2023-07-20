import { produce } from "immer";
import { BASE_PLAYER_OBJECT, CPU_COUNT, NAMES } from "./constants";
import usePlayerStore from "./store";

export default function usePlayerActions() {
  const { mainPlayer, cpus, setPlayer, setCpus } = usePlayerStore();

  const initPlayers = () => {
    setPlayer({
      ...BASE_PLAYER_OBJECT,
      id: "mainPlayer",
      name: "Lucas",
    });

    const newCpus = [];
    Array.from(Array(CPU_COUNT)).forEach((_, i) => {
      newCpus.push({
        ...BASE_PLAYER_OBJECT,
        id: `cpu-${i}`,
        name: NAMES[Math.floor(Math.random() * NAMES.length)],
      });
    });

    setCpus(newCpus);
  };

  //   TODO: consider big blind and small blind + game rotations
  const assignCardsToPlayers = (shuffledDeck: Deck): Deck => {
    const newCpus = produce(cpus, (draft) => {
      draft.forEach((cpu) => {
        cpu.hand = [];
      });

      draft.forEach((cpu) => {
        cpu.hand.push(shuffledDeck.pop());
        cpu.hand.push(shuffledDeck.pop());
      });
    });

    setCpus(newCpus);

    setPlayer({
      ...mainPlayer,
      hand: [shuffledDeck.pop(), shuffledDeck.pop()],
    });

    return shuffledDeck;
  };

  return {
    initPlayers,
    assignCardsToPlayers,
  };
}
