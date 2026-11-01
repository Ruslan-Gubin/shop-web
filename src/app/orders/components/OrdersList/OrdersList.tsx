"use client";
import { useRouter } from "next/navigation";
import { useEffectEvent, useLayoutEffect, useState } from "react";
import type { OrderModel } from "@/app/checkout/action";
import { getUpdateQueryPageString } from "@/shared/helpers/getUpdateQueryPageString";
import { LoadMoreObserver } from "@/shared/ui/load-more-observer/LoadMoreObserver";
import type { OrdersSearchParams, OrdersViewFlag } from "../../types";
import { OrderCard } from "../OrderCard/OrderCard";
import styles from "./OrdersList.module.css";

type Props = {
  orders: OrderModel[];
  viewFlag: OrdersViewFlag;
  limit: number;
  total: number;
  isLoadMoreDisabled: boolean;
  searchParams: OrdersSearchParams;
  patch: string;
};

export const OrdersList = (props: Props) => {
  const router = useRouter();
  const [data, setData] = useState<OrderModel[]>([]);
  const currentPage: number = Number(props.searchParams.page || "1");

  const getUpdateDataEvent = useEffectEvent((orders: OrderModel[]) => {
    const updateData: OrderModel[] = [];

    const isValidPageData = data.length === props.limit * (currentPage - 1);

    if (!isValidPageData && currentPage > 1) {
      router.push(getUpdateQueryPageString(props.patch, props.searchParams, 1));
    } else {
      if (currentPage > 1) {
        for (let i = 0; i < data.length; i++) {
          updateData.push(data[i]);
        }
      }

      for (let i = 0; i < orders.length; i++) {
        if (updateData.findIndex((el) => el.id === orders[i].id) === -1) {
          updateData.push(orders[i]);
        }
      }
    }

    setData(updateData);
  });

  useLayoutEffect(() => {
    getUpdateDataEvent(props.orders);
  }, [props.orders]);

  const isValidDataFromGetMore =
    data.length === currentPage * props.limit && data.length < props.total;

  return (
    <div className={styles.root}>
      <ul className={styles.list}>
        {(data.length > 0 ? data : props.orders).map((order) => (
          <li key={order.id}>
            <OrderCard order={order} />
          </li>
        ))}
      </ul>

      <LoadMoreObserver
        disabled={props.isLoadMoreDisabled || !isValidDataFromGetMore}
        patch={"/orders"}
        searchParams={props.searchParams}
        isValidDataFromPage={isValidDataFromGetMore}
        currentPage={currentPage}
      />
    </div>
  );
};
