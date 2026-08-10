"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { OrderModel, OrderStatus } from "@/app/checkout/action";
import { formatterRub } from "@/shared/helpers/formatters";
import { getOrderStatusColor, getOrderStatusLabel } from "@/shared/helpers/orderStatus";
import styles from "./order-detail.module.css";

/* ---------- мок-данные (пока нет GET /orders/[id]) ---------- */
const MOCK_PRODUCTS = [
  { name: "Платье летнее", count: 1, price: 4500 },
  { name: "Сумка кожаная", count: 2, price: 3500 },
  { name: "Туфли", count: 1, price: 6200 },
];

const MOCK_STATUSES: OrderStatus[] = [
  "new",
  "processing",
  "in_delivery",
  "completed",
];

const mockOrder = (id: number): OrderModel => ({
  id,
  create_user_id: 1,
  order_number: `ORD-${String(id).padStart(6, "0")}`,
  comment: "",
  status: MOCK_STATUSES[id % MOCK_STATUSES.length],
  rejected_reason: "",
  phone: "+7 (999) 123-45-67",
  phoneCode: "+7",
  recipient_name: "Иван Петров",
  payment_method: id % 2 === 0 ? "card" : "cash",
  method_receipt: id % 3 === 0 ? "pickup" : "courier",
  date_from: new Date(Date.now() + 86400000),
  date_to: new Date(Date.now() + 86400000 + 3600000),
  discount: Math.floor(Math.random() * 1000) + 200,
  created_at: new Date(),
  updated_at: null,
});

const formatDate = (date: Date | null): string => {
  if (!date) return "—";
  return new Intl.DateTimeFormat("ru", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

const formatDeliveryDate = (date: Date | null): string => {
  if (!date) return "—";
  return new Intl.DateTimeFormat("ru", {
    weekday: "short",
    day: "numeric",
    month: "long",
  }).format(new Date(date));
};

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const orderId = Number(params.id);
  const [order, setOrder] = useState<OrderModel | null>(null);
  const [loading, setLoading] = useState(Number.isNaN(orderId) ? false : true);

  useEffect(() => {
    // TODO: заменить на реальный fetch GET /orders/[id]
    if (Number.isNaN(orderId)) {
      return;
    }

    const timer = setTimeout(() => {
      setOrder(mockOrder(orderId));
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [orderId]);

  if (loading) {
    return (
      <section className={styles.page}>
        <div className={styles.error}>Загрузка заказа…</div>
      </section>
    );
  }

  if (!order || Number.isNaN(orderId)) {
    return (
      <section className={styles.page}>
        <div className={styles.error}>
          <p>Заказ не найден</p>
          <Link href="/" className={styles.backLink}>
            ← Вернуться на главную
          </Link>
        </div>
      </section>
    );
  }

  const receiptLabel = order.method_receipt === "courier" ? "Курьер" : "Самовывоз";
  const paymentLabel = order.payment_method === "card" ? "Банковской картой" : "Наличными";
  const statusColor = getOrderStatusColor(order.status);

  const total = MOCK_PRODUCTS.reduce((sum, p) => sum + p.price * p.count, 0);
  const deliveryPrice = order.method_receipt === "courier" ? 100 : 0;
  const grandTotal = total - order.discount + deliveryPrice;

  return (
    <section className={styles.page}>
      {/* Шапка — номер и статус */}
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.orderNumber}>Заказ {order.order_number}</h1>
          <p className={styles.orderDate}>
            от {formatDate(order.created_at)}
          </p>
        </div>
        <span
          className={styles.statusBadge}
          style={{ background: `${statusColor}18`, color: statusColor }}
        >
          {getOrderStatusLabel(order.status)}
        </span>
      </div>

      {/* Доставка */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Доставка</h2>
        <div className={styles.cardRow}>
          <span className={styles.cardLabel}>Способ получения</span>
          <span className={styles.cardValue}>{receiptLabel}</span>
        </div>
        <div className={styles.cardRow}>
          <span className={styles.cardLabel}>Дата доставки</span>
          <span className={styles.cardValue}>
            {formatDeliveryDate(order.date_from)}{" "}
            {order.date_from && order.date_to
              ? `${new Date(order.date_from).getHours()}:00 – ${new Date(order.date_to).getHours()}:00`
              : ""}
          </span>
        </div>
        <div className={styles.cardRow}>
          <span className={styles.cardLabel}>Получатель</span>
          <span className={styles.cardValue}>{order.recipient_name}</span>
        </div>
        <div className={styles.cardRow}>
          <span className={styles.cardLabel}>Телефон</span>
          <span className={styles.cardValue}>{order.phone}</span>
        </div>
        {order.comment && (
          <div className={styles.cardRow}>
            <span className={styles.cardLabel}>Комментарий</span>
            <span className={styles.cardValue}>{order.comment}</span>
          </div>
        )}
      </div>

      {/* Оплата */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Оплата</h2>
        <div className={styles.cardRow}>
          <span className={styles.cardLabel}>Способ оплаты</span>
          <span className={styles.cardValue}>{paymentLabel}</span>
        </div>
      </div>

      {/* Состав заказа */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Состав заказа</h2>
        {MOCK_PRODUCTS.map((product, idx) => (
          <div key={idx}>
            {idx > 0 && <div className={styles.divider} />}
            <div className={styles.productItem}>
              <span className={styles.productName}>{product.name}</span>
              <span className={styles.productCount}>{product.count} шт.</span>
              <span className={styles.productPrice}>
                {formatterRub.format(product.price * product.count)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Итого */}
      <div className={styles.card}>
        <div className={styles.totalSection}>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Товары</span>
            <span className={styles.totalValue}>{formatterRub.format(total)}</span>
          </div>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Скидка</span>
            <span className={styles.totalValue}>−{formatterRub.format(order.discount)}</span>
          </div>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Доставка</span>
            <span className={styles.totalValue}>
              {deliveryPrice > 0 ? formatterRub.format(deliveryPrice) : "Бесплатно"}
            </span>
          </div>
          <div className={styles.divider} />
          <div className={styles.grandTotal}>{formatterRub.format(grandTotal)}</div>
        </div>
      </div>

      {/* Назад */}
      <Link href="/" className={styles.backLink}>
        ← Вернуться на главную
      </Link>
    </section>
  );
}
