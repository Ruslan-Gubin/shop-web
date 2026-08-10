import { createStore } from "../services/create-store";
import type { QuickViewInitState } from "./types";

export const quickViewStore = createStore<QuickViewInitState>({
  isOpen: false,
  product_id: 0,
});
