import type { OrdersViewFlag, OrderView } from "../types";

type OrdersSearchParams = {
  [key: string]: string | string[] | undefined;
};

const hasParam = (searchParams: OrdersSearchParams, key: string) =>
  Object.prototype.hasOwnProperty.call(searchParams, key);

export const getOrdersViewFlag = (searchParams: OrdersSearchParams): OrdersViewFlag => {
  if (hasParam(searchParams, "purchases")) {
    return "purchases";
  }

  if (hasParam(searchParams, "waiting")) {
    return "waiting";
  }

  return "all";
};

export const getOrdersView = (viewFlag: OrdersViewFlag): OrderView => {
  if (viewFlag === "purchases") {
    return "purchases";
  }

  if (viewFlag === "waiting") {
    return "waiting";
  }

  return "orders";
};

export const getOrdersPageUrl = (viewFlag: OrdersViewFlag, page: number) =>
  page > 1 ? `/orders?${viewFlag}&page=${page}` : `/orders?${viewFlag}`;
