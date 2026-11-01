import Link from "next/link";
import type { OrdersCounts, OrdersViewFlag } from "../../types";
import styles from "./OrdersTabs.module.css";

type Props = {
  viewFlag: OrdersViewFlag;
  counts: OrdersCounts | null;
};

export const OrdersTabs = (props: Props) => {
  const tabs: {
    flag: OrdersViewFlag;
    label: string;
    isActive: boolean;
    count: number;
  }[] = [
    {
      flag: "orders",
      label: "Заказы",
      isActive: props.viewFlag === "orders",
      count: props.counts?.orders || 0,
    },
    {
      flag: "purchases",
      label: "Покупки",
      isActive: props.viewFlag === "purchases",
      count: props.counts?.purchases || 0,
    },
    {
      flag: "waiting",
      label: "Лист ожидания",
      isActive: props.viewFlag === "waiting",
      count: props.counts?.waiting || 0,
    },
  ];

  return (
    <nav className={styles.root} aria-label="Виды заказов">
      <ul className={styles.list}>
        {tabs.map((tab) => (
          <li key={tab.flag}>
            <Link
              href={`/orders?${tab.flag}`}
              className={tab.isActive ? `${styles.tab} ${styles.tabActive}` : styles.tab}
              aria-current={tab.isActive ? "page" : undefined}
            >
              <span>
                {tab.label}
                {tab.count > 0 ? (tab.count > 99 ? ": 99+" : `: ${tab.count}`) : ""}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
