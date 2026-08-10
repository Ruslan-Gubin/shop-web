"use client";
import { quickViewAdapter } from "@/stores/quick-view/adapter";
import styles from "./QuickViewButton.module.css";

type Props = {
  product_id: number;
};

export const QuickViewButton = (props: Props) => {
  const handleActiveModal = () => {
    quickViewAdapter.openModal(props.product_id);
  };

  return (
    <button onClick={handleActiveModal} type="button" className={styles.fastViewButton}>
      Быстрый просмотр
    </button>
  );
};
