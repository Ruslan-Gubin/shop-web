import type { Metadata } from "next";
import type { WarehouseModel } from "@/app/checkout/action";
import { CONFIG_APP } from "@/shared/config/config";
import { PageHeader } from "@/shared/ui/page-header/PageHeader";
import type { AddressItem } from "@/stores/checkout/types";
import { ErrorList } from "@/views/error-list/ErrorList";
import { UpdateToken } from "@/views/UpdateToken/UpdateToken";
import { fetchContactsWarehouses } from "./action";
import { ContactsMap } from "./ContactsMap";
import styles from "./Page.module.css";

export const metadata: Metadata = {
  title: "Контакты магазина «Радуга»",
  description:
    "Адрес, телефон и режим работы магазина «Радуга» в Донецке. Как до нас добраться и где нас найти.",
};

export default async function ContactsPage() {
  const warehousesData = await fetchContactsWarehouses();
  const warehouses: WarehouseModel[] =
    warehousesData.status === "success" && warehousesData.data ? warehousesData.data : [];

  const phone = "+7 949 386 57 86";
  const phoneHref = "tel:+79493865786";
  const email = "gubin_ruslan@rambler.ru";
  const emailHref = "mailto:gubin_ruslan@rambler.ru";
  const workTime = "Пн-вс с 9:00 до 17:00";
  const DEFAULT_CENTER = { lat: 48.0159, lng: 37.8029 };

  const defaultWarehouse = warehouses.find((w) => w.address && w.is_active && w.default_warehouse);
  const firstActiveWarehouse = warehouses.find((w) => w.address && w.is_active);

  const targetWarehouse = defaultWarehouse
    ? defaultWarehouse
    : firstActiveWarehouse
      ? firstActiveWarehouse
      : null;
  const targetAddress = targetWarehouse ? targetWarehouse?.address : null;

  const markers: AddressItem[] = [];
  let hasWarehouse = false;
  const initCenter = { lat: DEFAULT_CENTER.lat, lng: DEFAULT_CENTER.lng };
  let addressValue = "";
  let yandexMapsUrl = "";

  if (targetAddress) {
    markers[0] = targetAddress;
    hasWarehouse = true;
    initCenter.lat = targetAddress.lat;
    initCenter.lng = targetAddress.lng;
    addressValue = `${targetAddress?.place || ""}, ${targetAddress.name}`;
    yandexMapsUrl = `https://yandex.com/maps/?ll=${targetAddress.lng},${targetAddress.lat}&z=18&pt=${targetAddress.lng},${targetAddress.lat},pmwtm1`;
  }

  return (
    <section className="page-wrapper">
      {warehousesData.tokens && <UpdateToken tokens={warehousesData.tokens} />}
      <ErrorList errorsList={[warehousesData]} />
      <PageHeader title="Контакты" />

      <ul className={styles.infoGrid}>
        {hasWarehouse && (
          <li className={styles.cardHover}>
            <a
              key="address"
              href={yandexMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.infoCard} ${styles.cardLink}`}
            >
              <span className={styles.title}>Адрес</span>
              <span className={styles.value}>{addressValue}</span>
            </a>
          </li>
        )}
        <li className={styles.cardHover}>
          <a href={phoneHref} className={`${styles.infoCard} ${styles.cardLink}`}>
            <span className={styles.title}>Телефон</span>
            <span className={styles.value}>{phone}</span>
          </a>
        </li>
        <li className={styles.cardHover}>
          <a href={emailHref} className={`${styles.infoCard} ${styles.cardLink}`}>
            <span className={styles.title}>Почта</span>
            <span className={styles.value}>{email}</span>
          </a>
        </li>

        <li className={styles.cardHover}>
          <div className={styles.infoCard}>
            <span className={styles.title}>Режим работы</span>
            <span className={styles.value}>{workTime}</span>
          </div>
        </li>
      </ul>

      {hasWarehouse && (
        <section className={styles.mapSection}>
          <div className={styles.mapWrapper}>
            <ContactsMap
              markers={markers}
              initCenter={initCenter}
              active={targetAddress}
              mapboxAccessToken={CONFIG_APP.MAPBOX_ACCESS_TOKEN}
              mapStyle={CONFIG_APP.MAPBOX_STYLE}
            />
          </div>
        </section>
      )}
    </section>
  );
}
