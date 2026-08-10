import { DeliveryCourierSvg } from "@/shared/svg/DeliveryCourierSvg";
import { DeliveryPickupSvg } from "@/shared/svg/DeliveryPickupSvg";
import { checkoutAdapter } from "@/stores/checkout/adapter";
import styles from "./SelectMethodReceipt.module.css";

type Props = {
  method_receipt: "pickup" | "courier";
};

export const SelectMethodReceipt = (props: Props) => {
  const handleChangeMethod = (value: "pickup" | "courier") => {
    checkoutAdapter.setMethodReceipt(value);
  };

  return (
    <ul className={styles.methodList}>
      <li>
        <button
          className={
            props.method_receipt === "pickup"
              ? `${styles.methodItem} ${styles.methodItemActive}`
              : styles.methodItem
          }
          onClick={() => handleChangeMethod("pickup")}
          type="button"
        >
          <div className={styles.methodDescription}>
            <div className={styles.titleLine}>
              <DeliveryPickupSvg />
              <span>Самовывоз</span>
            </div>
            <span className={styles.subTitle}>Минимальная сумма заказа 0 ₽</span>
          </div>
        </button>
      </li>
      <li>
        <button
          className={
            props.method_receipt === "courier"
              ? `${styles.methodItem} ${styles.methodItemActive}`
              : styles.methodItem
          }
          onClick={() => handleChangeMethod("courier")}
          type="button"
        >
          <div className={styles.methodDescription}>
            <div className={styles.titleLine}>
              <DeliveryCourierSvg />
              <span>Курьером</span>
            </div>
            <span className={styles.subTitle}>Минимальная сумма заказа 5000 ₽</span>
          </div>
        </button>
      </li>
    </ul>
  );
};
