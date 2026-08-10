"use client";
import { BankCardSvg } from "@/shared/svg/BankCardSvg";
import { CashSvg } from "@/shared/svg/CashSvg";
import { checkoutAdapter } from "@/stores/checkout/adapter";
import { checkoutStore } from "@/stores/checkout/store";
import { BasketInfoCard } from "../BasketInfoCard/BasketInfoCard";
import styles from "./BasketMethodCard.module.css";

export const BasketMethodCard = () => {
  const payment_method = checkoutStore((store) => store.payment_method);
  const handleChangeMethod = (value: "cash" | "card") => checkoutAdapter.changePaymentMethod(value);

  return (
    <BasketInfoCard title="Способ оплаты">
      <ul className={styles.methodList}>
        <li>
          <button
            className={
              payment_method === "cash"
                ? `${styles.methodItem} ${styles.methodItemActive}`
                : styles.methodItem
            }
            onClick={() => handleChangeMethod("cash")}
            type="button"
          >
            <CashSvg />
            <div className={styles.methodDescription}>
              <span>Наличными</span>
              <span>При получении</span>
            </div>
          </button>
        </li>
        <li>
          <button
            className={
              payment_method === "card"
                ? `${styles.methodItem} ${styles.methodItemActive}`
                : styles.methodItem
            }
            onClick={() => handleChangeMethod("card")}
            type="button"
          >
            <BankCardSvg />
            <div className={styles.methodDescription}>
              <span>Банковской картой</span>
              <span>Или QR при получении</span>
            </div>
          </button>
        </li>
      </ul>
    </BasketInfoCard>
  );
};
