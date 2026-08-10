"use client";
import { DeleteBasketSvg } from "@/shared/svg/DeleteBasketSvg";
import { modalsAdapter } from "@/stores/modals/adapter";
import styles from "./BasketProductDelete.module.css";

type Props = {
  product_id: number;
};

export const BasketProductDelete = (props: Props) => {
  const handleSelectDeleteItem = (id: number) => modalsAdapter.deleteItem(id);

  return (
    <button
      type="button"
      className={styles.actionButtonSvg}
      onClick={() => handleSelectDeleteItem(props.product_id)}
    >
      <DeleteBasketSvg size={20} />
    </button>
  );
};
