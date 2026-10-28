import { formatterRub } from "@/shared/helpers/formatters";
import { DeliveryCourierSvg } from "@/shared/svg/DeliveryCourierSvg";
import { DeliveryPickupSvg } from "@/shared/svg/DeliveryPickupSvg";
import { checkoutAdapter } from "@/stores/checkout/adapter";
import styles from "./SelectMethodReceipt.module.css";

type Props = {
  method_receipt: "pickup" | "courier";
  isDeliveryCourier: boolean;
  minOrderSum: number;
};

export const SelectMethodReceipt = (props: Props) => {
  const handleChangeMethod = (value: "pickup" | "courier") => {
    checkoutAdapter.setMethodReceipt(value);
  };

  const isActivePickup = props.method_receipt === "pickup" || !props.isDeliveryCourier;
  const isActiveCourier = props.method_receipt === "courier";

  return (
    <ul className={styles.methodList}>
      <li>
        <button
          className={
            isActivePickup ? `${styles.methodItem} ${styles.methodItemActive}` : styles.methodItem
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
          disabled={!props.isDeliveryCourier}
          className={
            isActiveCourier
              ? `${styles.methodItem} ${styles.methodItemActive} ${!props.isDeliveryCourier ? styles.disabled : ""}`
              : `${styles.methodItem} ${!props.isDeliveryCourier ? styles.disabled : ""}`
          }
          onClick={() => handleChangeMethod("courier")}
          type="button"
        >
          <div className={styles.methodDescription}>
            <div className={styles.titleLine}>
              <DeliveryCourierSvg />
              <span>Курьером</span>
            </div>
            {!props.isDeliveryCourier ? (
              <span className={styles.subTitle}>Планируем в будущем, пока недоступно.</span>
            ) : (
              <span className={styles.subTitle}>
                {props.minOrderSum > 0
                  ? `Минимальная сумма заказа ${formatterRub.format(props.minOrderSum)}`
                  : "Минимальная сумма заказа зависит от адреса доставки"}
              </span>
            )}
          </div>
        </button>
      </li>
    </ul>
  );
};
