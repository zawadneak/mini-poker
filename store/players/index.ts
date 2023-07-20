import usePlayerActions from "./actions";
import usePlayerStore from "./store";

export default function usePlayers() {
  const store = usePlayerStore();
  const actions = usePlayerActions();

  return { store, actions };
}
