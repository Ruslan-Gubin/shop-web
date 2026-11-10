import type { Metadata } from "next";
import Link from "next/link";
import { type AssortmentIconName, AssortmentSvg } from "@/shared/svg/AssortmentSvg";
import { fetchContactsWarehouses } from "@/app/services/contacts/action";
import type { WarehouseModel } from "@/app/checkout/action";
import { PageHeader } from "@/shared/ui/page-header/PageHeader";
import { Button } from "@/shared/ui/button-main/Button";
import { ErrorList } from "@/views/error-list/ErrorList";
import { UpdateToken } from "@/views/UpdateToken/UpdateToken";
import styles from "./Page.module.css";

export const metadata: Metadata = {
  title: "О нас — интернет-магазин «Радуга»",
  description:
    "О магазине «Радуга» в Донецке: 25 лет работы, ассортимент товаров для дома, сада, праздника и быта. Контакты и условия покупки.",
};

const assortment: { icon: AssortmentIconName; label: string }[] = [
  { icon: "toys", label: "Игрушки" },
  { icon: "stationery", label: "Канцтовары" },
  { icon: "household", label: "Хозтовары и бытовая химия" },
  { icon: "dishes", label: "Посуда" },
  { icon: "electronics", label: "Электротовары" },
  { icon: "garden", label: "Товары для сада и огорода" },
  { icon: "holiday", label: "Всё для праздника" },
];

const attention = [
  {
    title: "Консультация и помощь",
    text: "Мы разбираемся в товарах и готовы подсказать: будь то игрушка для ребёнка или удобрение для огорода.",
  },
  {
    title: "Контроль качества",
    text: "Перед тем как товар попадает на полку, мы его проверяем — где это необходимо.",
  },
  {
    title: "Безопасная упаковка",
    text: "Хрупкие позиции (посуда и подобное) дополнительно оборачиваются плотной бумагой, любой заказ упаковывается в пакет или коробку.",
  },
  {
    title: "Самовывоз в удобное время",
    text: "В личном кабинете вы видите статус заказа и можете выбрать время, когда вам удобно забрать покупку. Весь товар хранится на складе при магазине — это помогает быстро обрабатывать заказы.",
  },
  {
    title: "Доставка по Петровскому району",
    text: "В планах. Следите за обновлениями — скоро появится ещё один способ получить заказ.",
  },
];

const steps = [
  {
    title: "Выберите товар",
    text: "Откройте каталог на сайте и найдите то, что нужно.",
  },
  {
    title: "Оформите заказ",
    text: "Укажите данные и выберите удобное время получения.",
  },
  {
    title: "Получите заказ",
    text: "Мы соберём его на складе и отправим уведомление в личный кабинет.",
  },
];

export default async function AboutPage() {
  const warehousesData = await fetchContactsWarehouses();
  const warehouses: WarehouseModel[] =
    warehousesData.status === "success" && warehousesData.data ? warehousesData.data : [];

  const defaultWarehouse = warehouses.find((w) => w.address && w.is_active && w.default_warehouse);
  const firstActiveWarehouse = warehouses.find((w) => w.address && w.is_active);
  const targetWarehouse = defaultWarehouse ? defaultWarehouse : firstActiveWarehouse ?? null;
  const targetAddress = targetWarehouse?.address ?? null;

  return (
    <section className="page-wrapper">
      {warehousesData.tokens && <UpdateToken tokens={warehousesData.tokens} />}
      <ErrorList errorsList={[warehousesData]} />
      <PageHeader title="О нас" />

      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>О нас</h2>
        <p className={styles.text}>
          «Радуга» — магазин в Донецке, который работает для людей уже более 25 лет. За это время
          ассортимент расширился: сегодня он охватывает основные категории повседневного спроса — от
          игрушек и товаров для праздника до хозтоваров, посуды, электротоваров и всего для сада и
          огорода.
        </p>
        <p className={styles.text}>
          Мы не используем «мифические» акции и не завышаем изначальные цены ради скидок.
          Ассортимент формируется на основе спроса покупателей: поставщики — крупные компании из
          России, а перед поступлением в продажу товар проходит проверку. Если что-то не подошло —
          готовы рассмотреть вопрос возврата индивидуально.
        </p>
        <p className={styles.text}>
          Нам важно, чтобы покупки были простыми и удобными, а покупатель получил нужный товар без
          спешки и сомнений. Поэтому мы не стремимся к масштабности в ущерб качеству обслуживания и
          дорожим долгосрочным доверием: чтобы в магазин возвращались, а условия оставались
          прозрачными и предсказуемыми.
        </p>

        <h3 className={styles.sectionTitle}>Ассортимент</h3>
        <ul className={styles.list}>
          {assortment.map((item) => (
            <li key={item.label}>
              <span className={styles.itemTitle}>{item.label}</span>
            </li>
          ))}
        </ul>

        <h3 className={styles.sectionTitle}>На что мы обращаем внимание</h3>
        <ul className={styles.list}>
          {attention.map((item) => (
            <li key={item.title}>
              <span className={styles.itemTitle}>{item.title}</span>
              <span className={styles.itemText}>{item.text}</span>
            </li>
          ))}
        </ul>

        <h3 className={styles.sectionTitle}>Как сделать заказ</h3>
        <ul className={styles.list}>
          {steps.map((step) => (
            <li key={step.title}>
              <span className={styles.itemTitle}>{step.title}</span>
              <span className={styles.itemText}>{step.text}</span>
            </li>
          ))}
        </ul>

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
