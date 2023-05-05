import useGameActions from "./actionts";
import useGameStore from "./store";

export default function useGame() {
  const store = useGameStore();
  const actions = useGameActions();

  return { store, actions };
}
