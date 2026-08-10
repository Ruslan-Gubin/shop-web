"use server";
import { cookies } from "next/headers";
import { CONFIG_APP } from "@/shared/config/config";
import { fetchService } from "@/shared/fetch-api";
import { updateTokensInAction } from "@/shared/helpers/updateCookieAction";
import { getValidatePayload } from "@/shared/services/get-form-action-state";
import { setErrorFromServer } from "@/shared/services/set-new-store-error-from-server";
import type { MapBoxGetSearchGeocodeResponse } from "@/shared/ui/mapbox/MapBox";
import type { AddressItem } from "@/stores/checkout/types";
import type { CartDiscountModel } from "../cart-discounts/action";
import type { ProductModel } from "../product/action";
import type { PromotionModel } from "../promotions/action";
import { createOrderSchema } from "./schema";

export type WarehouseModel = {
  id: number;
  create_user_id: 1;
  name: string;
  description: string;
  default_warehouse: boolean;
  is_active: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  address: {
    entrance: string;
    flat: string;
    floor: string;
    id: number;
    intercom: string;
    lat: number;
    lng: number;
    name: string;
    place: string;
    type: "pickup" | "courier";
  } | null;
};

export const fetchCheckoutData = async (
  basketIds: string,
  recentIds: string,
  favoriteIds: string,
) => {
  return await fetchService.fetchChain<
    [
      ProductModel[],
      CartDiscountModel[],
      PromotionModel[],
      WarehouseModel[],
      ProductModel[],
      ProductModel[],
    ]
  >([
    {
      url: "product/by-ids",
      params: { ids: basketIds },
      tags: [`Basket_${basketIds}`],
    },
    {
      url: "cart-discounts/active",
      tags: ["CartDiscounts"],
    },
    {
      url: "promotions/active",
      tags: ["Promotions"],
    },
    {
      url: "warehouses/public",
      tags: ["Warehouses"],
    },
    {
      url: "product/by-ids",
      params: { ids: recentIds },
      tags: [`CheckoutRecent_${recentIds}`],
    },
    {
      url: "product/recommended",
      params: {
        favorite_ids: favoriteIds,
        cart_ids: basketIds,
        viewed_ids: recentIds,
        limit: "30",
      },
      tags: [`CheckoutRecommended_${basketIds}`],
    },
  ]);
};

export type OrderStatus =
  | "new"
  | "cancelled_new"
  | "processing"
  | "cancelled_assembly"
  | "ready"
  | "in_delivery"
  | "cancelled_delivery"
  | "completed"
  | "cancelled_customer";

export type OrderModel = {
  id: number;
  create_user_id: number;
  order_number: string;
  comment: string;
  status: OrderStatus;
  rejected_reason: string;
  phone: string;
  phoneCode: string;
  recipient_name: string;
  payment_method: string;
  method_receipt: string;
  date_from: Date | null;
  date_to: Date | null;
  discount: number;
  created_at: Date;
  updated_at: Date | null;
};

export type CheckingBalancePayload = {
  product_id: number;
  quantity: number;
}[];

export type CheckingBalanceResponse = {
  status: "error" | "success";
  data: { product_id: number; available: number }[] | null;
};

export const checkingBalanceAction = async (
  payload: CheckingBalancePayload,
): Promise<CheckingBalanceResponse> => {
  const cookieStore = await cookies();

  return await fetchService
    .post<{ product_id: number; available: number }[]>({
      url: "product-stock/checking-balances",
      payload: payload,
    })
    .then((response) => {
      if (response.tokens) {
        updateTokensInAction(cookieStore, response.tokens);
      }

      return { status: response.status, data: response.data };
    });
};

export type CreateOrderPayload = {
  payment_method: "cash" | "card";
  date_from: Date;
  date_to: Date;
  method_receipt: "pickup" | "courier";
  comment: string;
  phone: string;
  phoneCode: string;
  recipient_name: string;
  address: AddressItem | null;
  products: { product_id: number; quantity: number }[];
};

export type CreateOrderResponse = {
  status: "error" | "success";
  errors: Record<keyof CreateOrderPayload, string>;
  data: OrderModel | null;
  message: string;
};

export const createOrderAction = async (
  payload: CreateOrderPayload,
): Promise<CreateOrderResponse> => {
  const { isValid, errors } = getValidatePayload(payload, createOrderSchema);

  if (isValid) {
    const cookieStore = await cookies();

    return await fetchService
      .post<OrderModel>({
        url: "orders/create",
        payload,
      })
      .then((response) => {
        if (response.tokens) {
          updateTokensInAction(cookieStore, response.tokens);
        }

        if (response.status === "error" && response.errors) {
          setErrorFromServer(response.errors, errors);
        }

        return { status: response.status, errors, data: response.data, message: response.message };
      });
  } else {
    return { status: "error", errors, data: null, message: "" };
  }
};

export type AddressModel = {
  id: number;
  type: "pickup" | "courier";
  name: string;
  place: string;
  lng: number;
  lat: number;
  entrance: string;
  flat: string;
  floor: string;
  intercom: string;
  order_id: number | null;
  warehouse_id: number | null;
};

// export type CreateAddressPayload = AddressItem & { order_id: number };

// export type CreateAddressResponse = {
//   status: "error" | "success";
//   errors: Record<keyof CreateAddressPayload, string>;
//   data: AddressModel | null;
// };

// export type CreateOrderProductPayload = {
//   product_id: number;
//   quantity: number;
//   order_id: number;
// };

// export type CreateOrderProductResponse = {
//   status: "error" | "success";
//   message: string;
//   errors: Record<keyof CreateOrderProductPayload, string>;
//   data: AddressModel | null;
// };

//TODO REMOVE
// export const createOrderProductAction = async (
//   payload: CreateOrderProductPayload,
// ): Promise<CreateOrderProductResponse> => {
//   const { isValid, errors } = getValidatePayload(payload, createOrderProductSchema);
//
//   if (isValid) {
//     const cookieStore = await cookies();
//
//     return await fetchService
//       .post<AddressModel>({
//         url: "order-product/create",
//         payload: payload,
//       })
//       .then((response) => {
//         if (response.tokens) {
//           updateTokensInAction(cookieStore, response.tokens);
//         }
//
//         if (response.status === "error" && response.errors) {
//           setErrorFromServer(response.errors, errors);
//         }
//
//         return { status: response.status, errors, data: response.data, message: response.message };
//       });
//   } else {
//     return { status: "error", errors, data: null, message: "" };
//   }
// };

export const fetchForwardAction = async (
  address: string,
): Promise<{
  lng: number;
  lat: number;
  name: string;
  place: string;
}> => {
  return fetch(
    `https://api.mapbox.com/search/geocode/v6/forward?q=${address}&access_token=${CONFIG_APP.MAPBOX_ACCESS_TOKEN}&language=ru&limit=1`,
  )
    .then((response) => response.json())
    .then((response: MapBoxGetSearchGeocodeResponse) => {
      const findFeature = response.features[0] ? response.features[0] : null;
      if (
        findFeature &&
        typeof findFeature?.properties?.name === "string" &&
        typeof findFeature.properties.context.place.name === "string" &&
        typeof findFeature.properties.coordinates.longitude === "number" &&
        typeof findFeature.properties.coordinates.latitude === "number"
      ) {
        return {
          lng: findFeature.properties.coordinates.longitude,
          lat: findFeature.properties.coordinates.latitude,
          name: findFeature.properties.name,
          place: findFeature.properties.context.place.name,
        };
      } else {
        throw "Not found address";
      }
    });
};

export const fetchReverseAction = async (
  lng: number,
  lat: number,
): Promise<{
  lng: number;
  lat: number;
  name: string;
  place: string;
}> => {
  return fetch(
    `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${lng}&latitude=${lat}&access_token=${CONFIG_APP.MAPBOX_ACCESS_TOKEN}&language=ru&types=address`,
  )
    .then((response) => response.json())
    .then((response: MapBoxGetSearchGeocodeResponse) => {
      const featureAddress = response.features.find(
        (el) => el.properties.feature_type === "address",
      );

      if (
        featureAddress &&
        typeof featureAddress?.properties?.name === "string" &&
        typeof featureAddress.properties.context.place.name === "string" &&
        typeof featureAddress?.properties?.coordinates?.longitude === "number" &&
        typeof featureAddress?.properties?.coordinates?.latitude === "number"
      ) {
        return {
          lng,
          lat,
          name: featureAddress.properties.name,
          place: featureAddress.properties.context.place.name,
        };
      } else {
        throw "Not found address";
      }
    });
};
