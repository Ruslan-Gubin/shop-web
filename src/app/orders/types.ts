import type { OrderModel } from "@/app/checkout/action";

export type { OrderModel };

export type OrderStatus =
  | "new"
  | "cancelled_new"
  | "processing"
  | "cancelled_assembly"
  | "ready"
  | "cancelled_ready"
  | "in_delivery"
  | "cancelled_delivery"
  | "completed"
  | "cancelled_customer";

export type OrderView = "orders" | "purchases" | "waiting";

export type OrdersViewFlag = "all" | "purchases" | "waiting";

export type OrdersCounts = {
  orders: number;
  purchases: number;
  waiting: number;
};

export type OrderReservation = {
  quantity: number;
  stock_id: number;
  warehouse_id: number;
};

export type OrderProductModel = {
  id: number;
  order_id: number;
  product_id: number;
  name: string;
  code: string;
  price: number;
  quantity: number;
  description: string;
  country: string;
  equipment: string;
  product_type: string;
  height: number | null;
  width: number | null;
  length: number | null;
  weight: number | null;
  created_at: string;
  updated_at: string;
  reservations: OrderReservation[];
  transfers: OrderReservation[];
  shortage_stocks: OrderReservation[];
};
