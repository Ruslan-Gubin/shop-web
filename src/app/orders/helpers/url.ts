import type { OrdersSearchParams, OrdersViewFlag } from "../types";

export const getOrdersViewFlag = (searchParams: OrdersSearchParams): OrdersViewFlag =>
  Object.hasOwn(searchParams, "purchases")
    ? "purchases"
    : Object.hasOwn(searchParams, "waiting")
      ? "waiting"
      : "orders";
