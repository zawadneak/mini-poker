import { gameStore } from "./game/store";
import GameStore, { Card } from "./game/types";
import { playerStore } from "./players/store";
import { PlayerStore } from "./players/types";

export default class GameSaver {
  static saveGame() {
    const store = {
      game: gameStore.getState(),
      players: playerStore.getState(),
    };
    localStorage.setItem("game", JSON.stringify(store));
  }

  static deleteGame() {
    localStorage.removeItem("game");
  }

  static async loadGame() {
    const store = await localStorage.getItem("game");
    if (store) {
      try {
        const baseGameStore = gameStore.getState();
        const basePlayerStore = playerStore.getState();

        const parsedStore: {
          game: GameStore;
          players: PlayerStore;
        } = JSON.parse(store);

        console.log(parsedStore.game);

        baseGameStore.setStore(parsedStore.game);
        basePlayerStore.setStore(parsedStore.players);
      } catch (e) {
        console.log(e);
      }
    }
  }
}
