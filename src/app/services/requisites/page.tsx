import type { Metadata } from "next";
import Link from "next/link";
import type { WarehouseModel } from "@/app/checkout/action";
import { fetchContactsWarehouses } from "@/app/services/contacts/action";
import { PageHeader } from "@/shared/ui/page-header/PageHeader";
import { Button } from "@/shared/ui/button-main/Button";
import { ErrorList } from "@/views/error-list/ErrorList";
import { UpdateToken } from "@/views/UpdateToken/UpdateToken";
import styles from "./Page.module.css";

export const metadata: Metadata = {
  title: "Реквизиты магазина «Радуга»",
  description:
    "Реквизиты интернет-магазина «Радуга»: ИП, ИНН, ОГРНИП, банковские реквизиты для безналичных платежей и контактные данные.",
};

export default async function RequisitesPage() {
  const warehousesData = await fetchContactsWarehouses();
  const warehouses: WarehouseModel[] =
    warehousesData.status === "success" && warehousesData.data ? warehousesData.data : [];

  return (
    <section className="page-wrapper">
      {warehousesData.tokens && <UpdateToken tokens={warehousesData.tokens} />}
      <ErrorList errorsList={[warehousesData]} />
      <PageHeader title="Реквизиты" />

      <div className={styles.card}>
        <p className={styles.text}>
          Мы работаем как индивидуальный предприниматель — это позволяет нам оставаться гибкими и
          лично следить за заказами. Все документы и отчётность ведутся в полном соответствии с
          действующим законодательством.
        </p>

        <h3 className={styles.sectionTitle}>Основные сведения</h3>
        <ul className={styles.list}>
          <li>
            <span className={styles.itemTitle}>Полное наименование:</span>
            <span className={styles.itemText}>ИП [недоступно]</span>
          </li>
          <li>
            <span className={styles.itemTitle}>ИНН:</span>
            <span className={styles.itemText}>[недоступно]</span>
          </li>
          <li>
            <span className={styles.itemTitle}>ОГРНИП:</span>
            <span className={styles.itemText}>[недоступно]</span>
          </li>
        </ul>

        <h3 className={styles.sectionTitle}>Контактная и фактическая информация</h3>
        <ul className={styles.list}>
          <li>
            <span className={styles.itemTitle}>Адрес магазина (место выдачи заказов):</span>{" "}
            <span className={styles.itemText}>
              Донецк, Петровский район, ул. Культурная, 2
            </span>
          </li>
          <li>
            <span className={styles.itemTitle}>Телефон администратора:</span>{" "}
            <span className={styles.itemText}>
              <a href="tel:+79493865786" className={styles.phoneBold}>
                +7 949 386 57 86
              </a>
            </span>
          </li>
          <li>
            <span className={styles.itemTitle}>Электронная почта:</span>
            <span className={styles.itemText}>
              <a href="mailto:gubin_ruslan@rambler.ru" className={styles.phoneBold}>
                gubin_ruslan@rambler.ru
              </a>
            </span>
          </li>
        </ul>

        <h3 className={styles.sectionTitle}>
          Расчётные реквизиты для безналичных платежей (для юрлиц и оптовых заказов)
        </h3>
        <ul className={styles.list}>
          <li>
            <span className={styles.itemTitle}>Банк:</span>
            <span className={styles.itemText}>[недоступно]</span>
          </li>
          <li>
            <span className={styles.itemTitle}>Расчётный счёт:</span>
            <span className={styles.itemText}>[недоступно]</span>
          </li>
          <li>
            <span className={styles.itemTitle}>БИК:</span>
            <span className={styles.itemText}>[недоступно]</span>
          </li>
          <li>
            <span className={styles.itemTitle}>Корреспондентский счёт:</span>
            <span className={styles.itemText}>[недоступно]</span>
          </li>
          <li>
            <span className={styles.itemTitle}>ИНН банка:</span>
            <span className={styles.itemText}>[недоступно]</span>
          </li>
          <li>
            <span className={styles.itemTitle}>КПП банка:</span>
            <span className={styles.itemText}>[недоступно]</span>
          </li>
        </ul>

        <h3 className={styles.sectionTitle}>Назначение платежа</h3>
        <p className={styles.text}>
          При переводе средств обязательно указывайте в назначении платежа: «Оплата по счёту №[номер]
          / заказ №[номер заказа]». Это поможет быстрее идентифицировать платёж и избежать задержек.
        </p>

        <h3 className={styles.sectionTitle}>Важная информация</h3>
        <ul className={styles.list}>
          <li>
            <span className={styles.itemText}>
              Для розничных покупателей (физлиц) оплата принимается наличными или картой при получении
              — реквизиты для перевода не требуются.
            </span>
          </li>
          <li>
            <span className={styles.itemText}>
              Для оптовых заказов и безналичной оплаты с юрлицами мы выставляем счёт — запросите его у
              администратора по телефону или на email.
            </span>
          </li>
          <li>
            <span className={styles.itemText}>
              Все данные, указанные на сайте, предназначены исключительно для совершения платежей и
              оформления заказов. Мы не передаём реквизиты третьим лицам и соблюдаем требования по
              защите персональных и платёжных данных.
            </span>
          </li>
          <li>
            <span className={styles.itemText}>
              Если вы планируете безналичный расчёт или хотите получить счёт для организации —
              свяжитесь с нами, мы всё подготовим и подскажем, как правильно оформить платёж.
            </span>
          </li>
        </ul>

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
