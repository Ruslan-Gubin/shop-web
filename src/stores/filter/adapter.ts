import { filterStore } from "./store";

export class FilterAdapter {
  public setSizeCard(value: "normal" | "large") {
    return filterStore.setState({ sizeCard: value });
  }
}

export const filterAdapter = new FilterAdapter();
