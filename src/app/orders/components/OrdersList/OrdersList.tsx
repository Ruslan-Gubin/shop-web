"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useIntersectionObserver } from "@/shared/hooks/useIntersectionObserver";
import { getOrdersPageUrl } from "../../helpers/url";
import type { OrderModel, OrdersViewFlag } from "../../types";
import { OrderCard } from "../OrderCard/OrderCard";
import styles from "./OrdersList.module.css";

type Props = {
  orders: OrderModel[];
  viewFlag: OrdersViewFlag;
  page: string;
  limit: number;
  total: number;
  isLoadMoreDisabled: boolean;
};

export const OrdersList = (props: Props) => {
  const router = useRouter();
  const ref = useRef<HTMLDivElement | null>(null);
  const [data, setData] = useState<OrderModel[]>([]);
  const [prevOrders, setPrevOrders] = useState<OrderModel[]>([]);
  const currentPage: number = Number(props.page || "1");
  const isValidPageData = data.length === props.limit * (currentPage - 1);

  if (prevOrders !== props.orders && (currentPage === 1 || isValidPageData)) {
    const updateData: OrderModel[] = currentPage > 1 ? [...data] : [];

    for (let i = 0; i < props.orders.length; i++) {
      if (updateData.findIndex((el) => el.id === props.orders[i].id) === -1) {
        updateData.push(props.orders[i]);
      }
    }

    setPrevOrders(props.orders);
    setData(updateData);
  }

  useEffect(() => {
    if (!isValidPageData && currentPage > 1) {
      router.push(getOrdersPageUrl(props.viewFlag, 1));
    }
  }, [isValidPageData, currentPage, props.viewFlag, router]);

  const isValidDataFromGetMore =
    data.length === currentPage * props.limit && data.length < props.total;

  const onIntersect = () => {
    router.push(getOrdersPageUrl(props.viewFlag, currentPage + 1), {
      scroll: false,
      transitionTypes: ["LoadMore"],
    });
  };

  useIntersectionObserver({
    target: ref,
    onIntersect,
    threshold: 1,
    disabled: props.isLoadMoreDisabled || !isValidDataFromGetMore,
  });

  return (
    <div className={styles.root}>
      <ul className={styles.list}>
        {(data.length > 0 ? data : props.orders).map((order) => (
          <li key={order.id}>
            <OrderCard order={order} />
          </li>
        ))}
      </ul>
      <div ref={ref} className={styles.observer} />
    </div>
  );
};
