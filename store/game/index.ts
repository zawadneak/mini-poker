import useGameActions from "./actions";
import useGameStore from "./store";

export default function useGame() {
  const store = useGameStore();
  const actions = useGameActions();

  return { store, actions };
}
