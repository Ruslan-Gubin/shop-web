import { createStore } from "../services/create-store";
import type { FilterInitState } from "./types";

export const filterStore = createStore<FilterInitState>(
  {
    sizeCard: "normal",
  },
  "filter",
);
