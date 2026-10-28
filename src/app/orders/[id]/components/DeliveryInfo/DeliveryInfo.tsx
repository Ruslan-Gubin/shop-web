import { CONFIG_APP } from "@/shared/config/config";
import { formatDateRu } from "@/shared/helpers/formatters";
import { formatDeliveryInterval } from "../../../helpers/formatters";
import { getFullAddressItem } from "@/shared/helpers/getFullAddressItem";
import { getPhoneDisplay } from "@/shared/helpers/getFormattedPhone";
import type { OrderModel } from "../../../types";
import { CardTitle } from "../../../components/CardTitle/CardTitle";
import { OrderMap } from "../OrderMap/OrderMap";
import styles from "./DeliveryInfo.module.css";

type Props = {
  order: OrderModel;
};

export const DeliveryInfo = (props: Props) => {
  const { order } = props;
  const address = order.address || null;
  const rawPhoneDigits = `${order.phoneCode || ""}${order.phone || ""}`.replace(/\D/g, "");
  const phoneDigits = rawPhoneDigits.slice(-10);
  const phoneDisplay = getPhoneDisplay(`7${phoneDigits}`);
  const hasValidCoords =
    typeof address?.lat === "number" &&
    typeof address.lng === "number" &&
    !Number.isNaN(address.lat) &&
    !Number.isNaN(address.lng) &&
    address.lng >= -180 &&
    address.lng <= 180 &&
    address.lat >= -90 &&
    address.lat <= 90;

  return (
    <section className={styles.root}>
      <CardTitle title={order.method_receipt === "courier" ? "Доставка" : "Самовывоз"} />

      {order.date_from && (
        <div className={styles.row}>
          <span className={styles.label}>
            {order.method_receipt === "courier" ? "Дата доставки" : "Дата выдачи"}
          </span>
          <span className={styles.value}>
            {formatDeliveryInterval(order.date_from, order.date_to)}
          </span>
        </div>
      )}

      {order.status === "completed" && order.updated_at && (
        <div className={styles.row}>
          <span className={styles.label}>Дата выдачи</span>
          <span className={styles.value}>
            {formatDateRu(order.updated_at, {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      )}

      {order.recipient_name && (
        <div className={styles.row}>
          <span className={styles.label}>Получатель</span>
          <span className={styles.value}>{order.recipient_name}</span>
        </div>
      )}

      {order.phone && (
        <div className={styles.row}>
          <span className={styles.label}>Телефон</span>
          <span className={styles.value}>
            <a className={styles.phone} href={`tel:+${phoneDigits}`}>
              {phoneDisplay}
            </a>
          </span>
        </div>
      )}

      {order.comment && (
        <p className={styles.text}>
          <span className={styles.label}>Комментарий: </span>
          {order.comment}
        </p>
      )}

      {address && (
        <p className={styles.text}>
          <span className={styles.label}>
            {order.method_receipt === "courier" ? "Адрес: " : "Склад: "}
          </span>
          {getFullAddressItem(address)}
        </p>
      )}

      {address && hasValidCoords && (
        <div className={styles.mapContainer}>
          <OrderMap
            address={address}
            mapboxAccessToken={CONFIG_APP.MAPBOX_ACCESS_TOKEN}
            mapStyle={CONFIG_APP.MAPBOX_STYLE}
          />
        </div>
      )}
    </section>
  );
};
