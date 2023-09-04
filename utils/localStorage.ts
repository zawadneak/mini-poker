export default function useLocalStorage() {
  return {
    setItem: (key: string, value: any) => {
      if (process.env.TAMAGUI_TARGET === "native") {
        const AsyncStorage = require("react-native").AsyncStorage;

        return AsyncStorage.setItem(key, value);
      }

      return localStorage.setItem(key, value);
    },

    getItem: (key: string) => {
      if (process.env.TAMAGUI_TARGET === "native") {
        const AsyncStorage = require("react-native").AsyncStorage;

        return AsyncStorage.getItem(key);
      }

      return localStorage.getItem(key);
    },

    removeItem: (key: string) => {
      if (process.env.TAMAGUI_TARGET === "native") {
        const AsyncStorage = require("react-native").AsyncStorage;

        return AsyncStorage.removeItem(key);
      }

      return localStorage.removeItem(key);
    },
  };
}
