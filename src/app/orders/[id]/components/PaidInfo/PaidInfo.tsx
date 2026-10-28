import { formatterRub } from "@/shared/helpers/formatters";
import type { OrderModel } from "../../../types";
import { CardTitle } from "../../../components/CardTitle/CardTitle";
import styles from "./PaidInfo.module.css";

type Props = {
  order: OrderModel;
};

export const PaidInfo = (props: Props) => {
  const { order } = props;

  return (
    <section className={styles.root}>
      <CardTitle title="Оплата" />

      <div className={styles.row}>
        <span className={styles.label}>Способ оплаты</span>
        <span className={styles.value}>
          {order.payment_method === "card" ? "Банковской картой" : "Наличными"}
        </span>
      </div>

      {typeof order.subtotal === "number" && order.subtotal > 0 && (
        <div className={styles.row}>
          <span className={styles.totalLabel}>Всего на сумму</span>
          <span className={styles.totalValue}>{formatterRub.format(order.subtotal)}</span>
        </div>
      )}

      {typeof order.discount_quantity === "number" && order.discount_quantity > 0 && (
        <div className={styles.row}>
          <span className={styles.totalLabel}>Скидка за количество</span>
          <span className={styles.totalValue}>−{formatterRub.format(order.discount_quantity)}</span>
        </div>
      )}

      {typeof order.discount_percent === "number" && order.discount_percent > 0 && (
        <div className={styles.row}>
          <span className={styles.totalLabel}>
            {order.discount_name ? order.discount_name : "Процент скидки"}
          </span>
          <span className={styles.totalValue}>- {order.discount_percent}%</span>
        </div>
      )}

      {typeof order.discount_total === "number" &&
        typeof order.discount_quantity === "number" &&
        order.discount_total + order.discount_quantity > 0 && (
          <div className={styles.row}>
            <span className={styles.totalLabel}>Скидка всего</span>
            <span className={styles.totalValue}>
              −{formatterRub.format(order.discount_total + order.discount_quantity)}
            </span>
          </div>
        )}

      {order.method_receipt === "courier" && (
        <div className={styles.row}>
          <span className={styles.label}>Стоимость доставки</span>
          <span className={styles.value}>{formatterRub.format(order.delivery_price)}</span>
        </div>
      )}

      <div className={styles.divider} />

      {order.total > 0 && (
        <div className={styles.row}>
          <span className={styles.grandTotal}>Всего</span>
          <span className={styles.grandTotal}>{formatterRub.format(order.total)}</span>
        </div>
      )}
    </section>
  );
};
