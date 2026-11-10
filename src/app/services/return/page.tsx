import type { Metadata } from "next";
import Link from "next/link";
import type { WarehouseModel } from "@/app/checkout/action";
import { fetchContactsWarehouses } from "@/app/services/contacts/action";
import { PageHeader } from "@/shared/ui/page-header/PageHeader";
import { ErrorList } from "@/views/error-list/ErrorList";
import { UpdateToken } from "@/views/UpdateToken/UpdateToken";
import { Button } from "@/shared/ui/button-main/Button";
import styles from "./Page.module.css";

export const metadata: Metadata = {
  title: "Возврат и обмен товаров — без сложностей",
  description:
    "Если товар не подошёл или пришёл с браком — приходите в магазин с чеком, мы обсудим возврат или обмен индивидуально. Без скрытых условий.",
};

const conditions = [
  {
    title: "Товар не использовался",
    details: "Сохранён товарный вид, ярлыки, упаковка",
  },
  {
    title: "Есть подтверждение покупки",
    details: "Чек (бумажный/электронный) или данные заказа в личном кабинете",
  },
  {
    title: "Сроки",
    details: "Обсуждаются индивидуально при обращении",
  },
  {
    title: "Исключения",
    details: "Товары, не подлежащие возврату по закону (личная гигиена и т.п.)",
  },
];

const steps = [
  {
    title: "Принесите товар в магазин",
    text: "Лучше сразу с чеком или номером заказа.",
  },
  {
    title: "Расскажите администратору",
    text: "Объясните, что не подошло: цвет, размер, функционал или обнаружен брак.",
  },
  {
    title: "Дождитесь проверки",
    text: "Мы посмотрим состояние товара и сверим данные покупки.",
  },
  {
    title: "Получите решение",
    text: "Если возврат возможен — вернём деньги или предложим обмен на другой товар.",
  },
];

const specialCases = [
  {
    title: "Брак или дефект",
    text: "Если товар пришёл с недостатком, мы примем его даже без идеальной упаковки — главное, чтобы была понятна причина.",
  },
  {
    title: "Онлайн-заказ",
    text: "Порядок тот же: приходите в магазин, покажите подтверждение заказа, мы всё проверим.",
  },
  {
    title: "Индивидуальные ситуации",
    text: "Если случай нестандартный (например, заказ собирали под запрос) — обсудим отдельно.",
  },
];

const guarantees = [
  {
    title: "Никаких скрытых условий",
    text: "Всё обсуждаем открыто с администратором.",
  },
  {
    title: "Честная проверка",
    text: "Осматриваем товар при вас, фиксируем состояние.",
  },
  {
    title: "Возврат средств",
    text: "Способ возврата согласуется отдельно (наличные или на карту — если оплата была безналом).",
  },
];

export default async function ReturnPage() {
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
      <PageHeader title="Возврат и обмен товаров" />
      <ErrorList errorsList={[warehousesData]} />

      <div className={styles.card}>
        <p className={styles.subtitle}>Если товар не подошёл — приходите, обсудим.</p>
        <p className={styles.text}>
          В «Радуге» мы не хотим, чтобы покупатель остался с ненужной вещью. Если товар не оправдал
          ожиданий или оказался с недостатком — мы готовы рассмотреть возврат или обмен. Решение
          принимается индивидуально, чтобы учесть все детали.
        </p>

        <h3 className={styles.sectionTitle}>Условия возврата</h3>
        <ul className={styles.list}>
          {conditions.map((item) => (
            <li key={item.title}>
              <span className={styles.itemTitle}>{item.title}</span>
              <span className={styles.itemText}>{item.details}</span>
            </li>
          ))}
        </ul>

        <h3 className={styles.sectionTitle}>Пошагово — что делать</h3>
        <ul className={styles.list}>
          {steps.map((step) => (
            <li key={step.title}>
              <span className={styles.itemTitle}>{step.title}</span>
              <span className={styles.itemText}>{step.text}</span>
            </li>
          ))}
        </ul>

        <h3 className={styles.sectionTitle}>Особые случаи</h3>
        <ul className={styles.list}>
          {specialCases.map((item) => (
            <li key={item.title}>
              <span className={styles.itemTitle}>{item.title}</span>
              <span className={styles.itemText}>{item.text}</span>
            </li>
          ))}
        </ul>

        <h3 className={styles.sectionTitle}>Безопасность и прозрачность</h3>
        <ul className={styles.list}>
          {guarantees.map((item) => (
            <li key={item.title}>
              <span className={styles.itemTitle}>{item.title}</span>
              <span className={styles.itemText}>{item.text}</span>
            </li>
          ))}
        </ul>

        <p className={styles.text}>
          Нужна помощь или хотите заранее уточнить условия? можете позвонить на номер телефона{" "}
          <a href="tel:+79493865786" className={styles.phoneBold}>
            +7 949 386 57 86
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
