"use client";
import { DeleteBasketSvg } from "@/app/category/components/category-item/svg/DeleteBasketSvg";
import { basketStore } from "@/stores/basket/store";
import { modalsAdapter } from "@/stores/modals/adapter";
import styles from "./BasketListDelete.module.css";

export const BasketListDelete = () => {
  const selected = basketStore((store) => store.selected);

  const handleDeleteItems = (ids: number[]) => modalsAdapter.deleteMany(ids);

  return (
    <button
      type="button"
      disabled={selected.length === 0}
      className={styles.headerActionButton}
      onClick={() => handleDeleteItems(selected)}
    >
      <DeleteBasketSvg size={16} />
    </button>
  );
};
