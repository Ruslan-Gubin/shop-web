"use client";
import { basketStore } from "@/stores/basket/store";
import styles from "./BasketListTotal.module.css";

export const BasketListTotal = () => {
  const basket = basketStore((store) => store.items);

  const totalBasketCount = Object.values(basket).reduce((acc, count) => acc + count, 0);

  return <small className={styles.headerTotalProduct}>{totalBasketCount} шт.</small>;
};
