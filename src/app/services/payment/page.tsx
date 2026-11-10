import type { Metadata } from "next";
import Link from "next/link";
import type { WarehouseModel } from "@/app/checkout/action";
import { fetchContactsWarehouses } from "@/app/services/contacts/action";
import { UpdateToken } from "@/views/UpdateToken/UpdateToken";
import { ErrorList } from "@/views/error-list/ErrorList";
import styles from "./Page.module.css";
import { PageHeader } from "@/shared/ui/page-header/PageHeader";
import { Button } from "@/shared/ui/button-main/Button";

export const metadata: Metadata = {
  title: "Способы оплаты — наличными и картой",
  description:
    "Узнайте способы оплаты товаров в интернет-магазине: наличными при самовывозе, банковской картой на кассе или онлайн-оплатой на сайте. Без скрытых комиссий.",
};

const methods = [
  {
    title: "Наличными",
    place: "При самовывозе и курьерской доставке",
    details: "Оплатите наличными при получении заказа в магазине или при доставке курьером",
  },
  {
    title: "Банковской картой",
    place: "При самовывозе в магазине",
    details: "Оплата картой Visa, Mastercard, МИР на кассе при самовывозе",
  },
  {
    title: "Онлайн-оплата картой",
    place: "Скоро будет доступна",
    details: "Оплата на сайте появится в ближайшее время",
  },
];

const steps = [
  {
    title: "Корзина и оформление",
    text: "Выберите товары, укажите самовывоз и удобное время получения.",
  },
  {
    title: "Выбор способа",
    text: "На этапе оформления отметьте «Оплатить при получении» или «Оплатить онлайн».",
  },
  {
    title: "Подтверждение",
    text: "При самовывозе оплачиваете на кассе наличными или картой.",
  },
  {
    title: "Получение",
    text: "Когда заказ собран, вы получаете уведомление в личном кабинете и забираете товар в магазине.",
  },
];

const guarantees = [
  {
    title: "Прозрачность",
    text: "Итоговая сумма видна до оплаты, скрытых комиссий нет.",
  },
  {
    title: "Возврат",
    text: "Если товар не подошёл, мы готовы рассмотреть вопрос индивидуально. Условия уточняйте у администратора.",
  },
];

export default async function PaymentPage() {
  const warehousesData = await fetchContactsWarehouses();
  const warehouses: WarehouseModel[] =
    warehousesData.status === "success" && warehousesData.data ? warehousesData.data : [];

  const defaultWarehouse = warehouses.find((w) => w.address && w.is_active && w.default_warehouse);
  const firstActiveWarehouse = warehouses.find((w) => w.address && w.is_active);
  const targetWarehouse = defaultWarehouse ? defaultWarehouse : (firstActiveWarehouse ?? null);
  const targetAddress = targetWarehouse?.address ?? null;

  return (
    <section className="page-wrapper">
      {warehousesData.tokens && <UpdateToken tokens={warehousesData.tokens} />}
      <ErrorList errorsList={[warehousesData]} />
      <PageHeader title="Способы оплаты" />

      <div className={styles.card}>
        <p className={styles.text}>
          В нашем магазине вы можете оплатить покупку наличными или банковской картой при получении
          заказа. Онлайн-оплата появится в скором будущем.
        </p>

        <h3 className={styles.sectionTitle}>Доступные способы</h3>
        <ul className={styles.list}>
          {methods.map((method) => (
            <li key={method.title}>
              <span className={styles.itemTitle}>{method.title}</span>
              <span className={styles.itemText}>{method.place}</span>
              <span className={styles.itemText}>{method.details}</span>
            </li>
          ))}
        </ul>

        <h3 className={styles.sectionTitle}>Как оплатить заказ</h3>
        <ul className={styles.list}>
          {steps.map((step) => (
            <li key={step.title}>
              <span className={styles.itemTitle}>{step.title}</span>
              <span className={styles.itemText}>{step.text}</span>
            </li>
          ))}
        </ul>

        <h3 className={styles.sectionTitle}>Безопасность и гарантии</h3>
        <ul className={styles.list}>
          {guarantees.map((item) => (
            <li key={item.title}>
              <span className={styles.itemTitle}>{item.title}</span>
              <span className={styles.itemText}>{item.text}</span>
            </li>
          ))}
        </ul>

        <p className={styles.text}>
          Нужна помощь с оплатой или не уверены, какой способ выбрать? можете позвонить на номер
          телефона{" "}
          <a href="tel:+79493865786" className={styles.phoneBold}>
            +7 949 386 57 86
          </a>
          или написать на почту{" "}
          <a href="mailto:gubin_ruslan@rambler.ru" className={styles.phoneBold}>
            gubin_ruslan@rambler.ru
          </a>
          .
        </p>
        {targetAddress && (
          <p className={styles.text}>
            Магазин находится по адресу:{" "}
            <Link href="/services/contacts" className={styles.addressLink}>
              {`${targetAddress.place || ""}, ${targetAddress.name}`}
            </Link>
          </p>
        )}
        <p className={styles.text}>
          Если хотите всё увидеть своими глазами — приходите к нам в магазин. Мы с радостью поможем
          с выбором.
        </p>
      </div>

      <footer className={styles.footer}>
        <Link href="/" className={styles.buttonLinkWrapper}>
          <Button fullWidth customClass={styles.buttonLink} variant="solid" variantColor="violet">
            <p className={styles.btnText}>Перейти в каталог</p>
          </Button>
        </Link>
      </footer>
    </section>
  );
}
