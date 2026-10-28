import Link from "next/link";
import type { OrdersCounts, OrdersViewFlag } from "../../types";
import styles from "./OrdersTabs.module.css";

type Props = {
  viewFlag: OrdersViewFlag;
  counts: OrdersCounts | null;
};

const tabs: { flag: OrdersViewFlag; label: string; countKey: keyof OrdersCounts }[] = [
  { flag: "all", label: "Заказы", countKey: "orders" },
  { flag: "purchases", label: "Покупки", countKey: "purchases" },
  { flag: "waiting", label: "Лист ожидания", countKey: "waiting" },
];

export const OrdersTabs = (props: Props) => {
  return (
    <nav className={styles.root} aria-label="Виды заказов">
      <ul className={styles.list}>
        {tabs.map((tab) => {
          const isActive = props.viewFlag === tab.flag;
          const count = props.counts ? props.counts[tab.countKey] : 0;

          return (
            <li key={tab.flag}>
              <Link
                href={`/orders?${tab.flag}`}
                className={isActive ? `${styles.tab} ${styles.tabActive}` : styles.tab}
                aria-current={isActive ? "page" : undefined}
              >
                <span>{tab.label}</span>
                {count > 0 && <span className={styles.count}>{count}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
