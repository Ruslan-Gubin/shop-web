import { quickViewStore } from "./store";

export class QuickViewAdapter {
  private store = quickViewStore;

  public openModal(product_id: number) {
    this.store.setState({ isOpen: true, product_id });
  }

  public closeModal() {
    this.store.setState({ isOpen: false });
  }
}

export const quickViewAdapter = new QuickViewAdapter();
