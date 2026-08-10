"use client";
import Link from "next/link";
import { basketAdapter } from "@/stores/basket/adapter";
import { basketStore } from "@/stores/basket/store";
import { AddBasketLarge } from "../ProductCard/components/AddBasketLarge/AddBasketLarge";
import styles from "./ProductBasketActions.module.css";

type Props = {
  product_id: number;
  onCloseModalAction?: () => void;
  available: number | null;
};

export const ProductBasketActions = (props: Props) => {
  const count = basketStore((state) => state.items[props.product_id]) || 0;

  const handleBuyNow = () => {
    if (count < 1) {
      basketAdapter.add(props.product_id);
    }

    if (props.onCloseModalAction) {
      props.onCloseModalAction();
    }
  };

  return (
    <footer className={styles.actions}>
      <AddBasketLarge
        available={props.available}
        count={count}
        href={"/basket"}
        id={props.product_id}
        onCloseModalAction={props.onCloseModalAction}
      />
      <Link
        className={`${styles.actionButton} ${styles.actionButtonLight}`}
        href={"/basket"}
        onClick={handleBuyNow}
      >
        <span className={styles.addButtonTextLg}>Купить сейчас</span>
        <span className={styles.addButtonTextSm}>Купить</span>
      </Link>
    </footer>
  );
};
