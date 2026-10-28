import Link from "next/link";
import { formatterRub } from "@/shared/helpers/formatters";
import { formatDeliveryInterval, formatOrderDate } from "../../helpers/formatters";
import { getOrderCardStatusLabel, getOrderStatusColor } from "../../helpers/orderStatus";
import type { OrderModel } from "../../types";
import styles from "./OrderCard.module.css";

type Props = {
  order: OrderModel;
};

export const OrderCard = (props: Props) => {
  const { order } = props;
  const statusColor = getOrderStatusColor(order.status);
  const statusLabel = getOrderCardStatusLabel(order);
  const receiptLabel = order.method_receipt === "courier" ? "Курьер" : "Самовывоз";
  const paymentLabel = order.payment_method === "card" ? "Карта" : "Наличные";
  const orderDate = formatOrderDate(order.created_at);
  const deliveryLabel = formatDeliveryInterval(order.date_from, order.date_to);
  const hasDiscount = typeof order.discount_total === "number" && order.discount_total > 0;
  const basePrice =
    typeof order.subtotal === "number" && order.subtotal > 0 ? order.subtotal : order.total;
  const isCancelled = order.status.startsWith("cancelled");
  const showTotal = !isCancelled && !order.rejected_reason;
  const showDiscount = hasDiscount && showTotal;

  return (
    <Link
      href={`/orders/${order.id}`}
      className={styles.root}
      aria-label={`Заказ № ${order.order_number}`}
    >
      <div className={styles.header}>
        <h3>№ {order.order_number}</h3>
        {statusLabel && statusColor && (
          <span
            className={styles.statusBadge}
            style={{ color: statusColor, borderColor: `${statusColor}40`, backgroundColor: `${statusColor}18` }}
          >
            {statusLabel}
          </span>
        )}
      </div>

      <div className={styles.infoBlock}>
        {orderDate.length > 0 && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Дата оформления</span>
            <span className={styles.infoValue}>{orderDate}</span>
          </div>
        )}
        {deliveryLabel.length > 0 && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>
              {order.method_receipt === "courier" ? "Доставка" : "К выдаче"}
            </span>
            <span className={styles.infoValue}>{deliveryLabel}</span>
          </div>
        )}
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Получение</span>
          <span className={styles.infoValue}>{receiptLabel}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Оплата</span>
          <span className={styles.infoValue}>{paymentLabel}</span>
        </div>
        {showDiscount && (
          <>
            {basePrice > 0 && !Number.isNaN(basePrice) && (
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Цена без скидки</span>
                <span className={styles.infoValue}>{formatterRub.format(basePrice)}</span>
              </div>
            )}

            {order.discount_quantity > 0 && !Number.isNaN(order.discount_quantity) && (
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Скидка за количество</span>
                <span className={styles.infoValue}>
                  −{formatterRub.format(order.discount_quantity)}
                </span>
              </div>
            )}

            {order.discount_percent > 0 && !Number.isNaN(order.discount_percent) && (
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>
                  {order.discount_name ? order.discount_name : "Процент скидки"}
                </span>
                <span className={styles.infoValue}>- {order.discount_percent}%</span>
              </div>
            )}

            {order.discount_total > 0 && !Number.isNaN(order.discount_total) && (
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Скидка всего</span>
                <span className={styles.infoValue}>
                  −{formatterRub.format(order.discount_total + order.discount_quantity)}
                </span>
              </div>
            )}

            {order.method_receipt === "courier" && (
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Стоимость доставки</span>
                <span className={styles.infoValue}>
                  {formatterRub.format(order.delivery_price)}
                </span>
              </div>
            )}
          </>
        )}
        {order.recipient_name && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Получатель</span>
            <span className={styles.infoValue}>{order.recipient_name}</span>
          </div>
        )}
        {order.rejected_reason && (
          <p className={styles.rejectedText}>
            <span className={styles.infoLabel}>Причина отмены: </span>
            {order.rejected_reason}
          </p>
        )}
      </div>

      {showTotal && order.total > 0 && (
        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>Итого</span>
          <span className={styles.totalValue}>{formatterRub.format(order.total)}</span>
        </div>
      )}
    </Link>
  );
};
