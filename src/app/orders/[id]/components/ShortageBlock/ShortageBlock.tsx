"use client";
import { useState } from "react";
import { getProblemProductStocks } from "../../../helpers/shortage";
import type { OrderProductModel } from "../../../types";
import { CardTitle } from "../../../components/CardTitle/CardTitle";
import { ShortageModal } from "../ShortageModal/ShortageModal";
import styles from "./ShortageBlock.module.css";

type Props = {
  orderId: number;
  products: OrderProductModel[];
};

export const ShortageBlock = (props: Props) => {
  const [open, setOpen] = useState(false);

  const left = getProblemProductStocks(props.products);
  const notProductLeft = left === 0;
  const problemShortageStocksProducts = props.products.filter(
    (el) => Array.isArray(el.shortage_stocks) && el.shortage_stocks.length > 0,
  );

  return (
    <>
      <section className={styles.root}>
        <div className={styles.header}>
          <span className={styles.icon}>!</span>
          <div className={styles.headerText}>
            <CardTitle title="Проблема с остатками" />

            <span className={styles.subtitle}>
              {notProductLeft
                ? "Все товары из заказа закончились на складе"
                : "Некоторые товары требуют уточнения"}
            </span>
          </div>
        </div>

        <button type="button" className={styles.button} onClick={() => setOpen(true)}>
          {notProductLeft ? "Отменить заказ" : "Решить проблему"}
        </button>
      </section>

      <ShortageModal
        active={open}
        onClose={() => setOpen(false)}
        orderId={props.orderId}
        products={problemShortageStocksProducts}
        notProductLeft={notProductLeft}
      />
    </>
  );
};
