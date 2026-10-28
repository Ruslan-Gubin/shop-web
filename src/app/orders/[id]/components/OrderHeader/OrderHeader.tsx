import { formatDeliveryIntervalHours, formatOrderDate } from "../../../helpers/formatters";
import {
  cancelledStatuses,
  getOrderStatusColor,
  getOrderStatusLabel,
} from "../../../helpers/orderStatus";
import type { OrderModel } from "../../../types";
import { CancelOrderModal } from "../CancelOrderModal/CancelOrderModal";
import styles from "./OrderHeader.module.css";

type Props = {
  order: OrderModel;
};

export const OrderHeader = (props: Props) => {
  const { order } = props;
  const canCancel =
    order.status !== "completed" &&
    !cancelledStatuses.includes(order.status) &&
    typeof order.id === "number" &&
    order.id > 0;

  return (
    <section className={styles.root}>
      {order.status !== "ready" ? (
        <h3 style={{ color: getOrderStatusColor(order.status) }}>
          {getOrderStatusLabel(order.status)}
        </h3>
      ) : (
        <div className={styles.readyNotice}>
          <span className={styles.readyIcon}>✓</span>
          <div className={styles.readyTextWrap}>
            <span className={styles.readyTitle}>
              {order.method_receipt === "courier"
                ? "Заказ готов к доставке"
                : "Заказ готов к выдаче"}
            </span>
            <span className={styles.readyBody}>
              {order.method_receipt === "courier"
                ? "Ваш заказ собран. Передадим его курьеру — следите за обновлением статуса."
                : `Ваш заказ собран и ждёт вас. Забрать можно на складе ${formatDeliveryIntervalHours(order.date_from, order.date_to)}.`}
            </span>
          </div>
        </div>
      )}

      <div className={styles.dateRow}>
        <span className={styles.infoLabel}>Дата оформления</span>
        <span className={styles.infoValue}>{formatOrderDate(order.created_at)}</span>
      </div>

      {typeof order.rejected_reason === "string" && order.rejected_reason.length > 0 && (
        <p className={styles.rejectedText}>
          <span className={styles.infoLabel}>Причина отмены: </span>
          {order.rejected_reason}
        </p>
      )}

      {canCancel && <CancelOrderModal id={order.id} />}
    </section>
  );
};
