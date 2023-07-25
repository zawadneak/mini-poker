import useRoundActions from "./actions";
import useRoundStore from "./store";

export default function useRounds() {
  const store = useRoundStore();
  const actions = useRoundActions();

  return {
    store,
    actions,
  };
}
