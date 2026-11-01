"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import type { ProductModel, UserModel } from "@/app/action";
import { fetchService } from "@/shared/fetch-api";
import { updateTokensInAction } from "@/shared/helpers/updateCookieAction";
import type { OrderModel } from "../checkout/action";
import type { OrderProductModel, OrdersCounts, OrdersViewFlag } from "./types";

export type OrdersListResponse = {
  orders: OrderModel[];
  totalCount: number;
  paginationPage: string;
};

export type OrderMutationResponse = {
  status: "success" | "error";
  message: string;
};

export const fetchOrdersData = async (view: OrdersViewFlag, page: string, limit: number) =>
  fetchService.fetchChain<[OrdersListResponse, OrdersCounts, UserModel]>([
    {
      url: "orders/all-client",
      params: {
        limit: String(limit),
        page,
        view,
      },
    },
    {
      url: "orders/order-client-counts",
    },
    {
      url: "users/me",
    },
  ]);

export const fetchOrderDetailData = async (id: number) => {
  const [orderData, productsData, userData] = await fetchService.fetchChain<
    [OrderModel, OrderProductModel[], UserModel]
  >([
    {
      url: `orders/${id}`,
    },
    {
      url: `order-product/order/${id}`,
    },
    {
      url: "users/me",
    },
  ]);

  const ids = (productsData.data || []).map((el) => el.product_id).join(",");

  const productsOriginData = await fetchService.get<ProductModel[]>({
    url: "product/by-ids",
    params: { ids },
    updateToken: userData.tokens,
  });

  return { orderData, productsData, userData, productsOriginData };
};

export const rejectOrderAction = async (
  id: number,
  rejected_reason: string,
): Promise<OrderMutationResponse> => {
  const cookieStore = await cookies();

  const response = await fetchService.patch<null>({
    url: `orders/reject/${id}`,
    payload: { rejected_reason },
  });

  if (response.tokens) {
    updateTokensInAction(cookieStore, response.tokens);
  }

  if (response.status === "success") {
    revalidatePath("/orders");
    revalidatePath(`/orders/${id}`);
  }

  return { status: response.status, message: response.message };
};

export const acceptShortageAction = async (id: number): Promise<OrderMutationResponse> => {
  const cookieStore = await cookies();

  const response = await fetchService.post<null>({
    url: `orders/accept-shortage/${id}`,
    payload: {},
  });

  if (response.tokens) {
    updateTokensInAction(cookieStore, response.tokens);
  }

  if (response.status === "success") {
    revalidatePath("/orders");
    revalidatePath(`/orders/${id}`);
  }

  return { status: response.status, message: response.message };
};
