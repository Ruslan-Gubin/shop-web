import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { CookieService } from "@/shared/services/cookie/CookieService";

const persistMiddleware = (initState: any, persistName?: string, cookieKeys?: string[]) => {
  return !persistName
    ? initState
    : persist(initState, {
        name: persistName,
        storage: createJSONStorage(() => {
          return localStorage;
        }),
        partialize(state: Record<string, unknown>) {
          if (cookieKeys) {
            for (const key of cookieKeys) {
              if (Object.hasOwn(state, key) && typeof window !== "undefined") {
                CookieService.set(`${persistName}_${key}`, JSON.stringify(state[key]));
              }
            }
          }
          return state;
        },
      });
};

export const createStore = <T>(initState: T, persistName?: string, cookieKeys?: string[]) =>
  create<T>()(
    immer(
      process.env.NODE_ENV === "development"
        ? devtools(persistMiddleware(() => initState, persistName, cookieKeys))
        : persistMiddleware(() => initState, persistName, cookieKeys),
    ),
  );
