"use server";
import { cookies } from "next/headers";
import { CONFIG_APP } from "@/shared/config/config";
import { fetchService } from "@/shared/fetch-api";
import { updateTokensInAction } from "@/shared/helpers/updateCookieAction";
import type { SearchModel } from "./catalog/action";
import type { QuestionModel } from "./catalog/detail/[id]/action";

export type SpecificationModel = {
  id: number;
  name: string;
  type: "text" | "color" | "number";
  created_at: string;
  updated_at: string | null;
};

export type ProductSpecificationModel = {
  id: number;
  product_id: number;
  specification_id: number;
  value: string;
  created_at: Date;
  updated_at: Date | null;
  specification: SpecificationModel;
};

export type PhotoModel = {
  created_at: string;
  id: number;
  parent_id: number;
  parent_type: string;
  position: number;
  updated_at: string;
  url: string;
};

export interface ProductModel {
  id: number;
  name: string;
  code: string;
  brand_id: number;
  brand_name: string;
  category_id: number;
  description: string;
  country: string;
  product_type: string;
  equipment: string;
  weight: number;
  height: number;
  length: number;
  width: number;
  purchase_price: number;
  available: number;
  accounting: boolean;
  price_list: { price: number; minQuantity: number }[];
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string | null;
  photos: PhotoModel[];
  keywords: string;
  og_description: string;
  og_title: string;
  og_type: string;
  seo_description: string;
  seo_title: string;
  slug: string;
}

export const fetchProductsMainPage = async (limit: number, page?: string) => {
  return await fetchService.get<{
    paginationPage: string;
    products: ProductModel[];
    totalCount: number;
  }>({
    url: "product/main-page",
    params: {
      limit: String(limit),
      page: page ? String(page) : "1",
    },
    tags: ["Products"],
  });
};

export const fetchProduct = async (id: string) => {
  const cookieStore = await cookies();

  return await fetchService
    .get<ProductModel>({
      url: `product/${id}`,
      tags: [`Products_${id}`],
    })
    .then((response) => {
      if (response.tokens) {
        updateTokensInAction(cookieStore, response.tokens);
      }
      return response;
    });
};

export const fetchConnect = async () => {
  return await fetchService.get<null>({ url: "connect" });
};

export const logoutAction = async () => {
  const cookieStore = await cookies();

  return fetchService
    .post<null>({
      url: "auth/logout",
    })
    .then((response) => {
      if (response.tokens) {
        updateTokensInAction(cookieStore, response.tokens);
      }
      return { status: response.status, message: response.message };
    })
    .then((response) => {
      if (response.status === "success") {
        cookieStore.delete(CONFIG_APP.ACCESS_TOKEN_COOKIE);
        cookieStore.delete(CONFIG_APP.REFRESH_TOKEN_COOKIE);
      }
      return response;
    });
};

export const fetchSuggestionsAction = async (value: string): Promise<SearchModel[] | null> => {
  return fetchService
    .get<SearchModel[]>({
      url: "search",
      params: { text: value, limit: "7" },
    })
    .then((response) => {
      if (response.tokens) {
        cookies().then((cookieStore) => {
          updateTokensInAction(cookieStore, response.tokens);
        });
      }
      return response.data;
    });
};

export const fetchPopularSearchAction = async (): Promise<SearchModel[] | null> => {
  return fetchService
    .get<SearchModel[]>({
      url: "search/popular",
      params: { limit: "7" },
    })
    .then((response) => {
      if (response.tokens) {
        cookies().then((cookieStore) => {
          updateTokensInAction(cookieStore, response.tokens);
        });
      }
      return response.data;
    });
};

export const fetchProductPrices = async (product_id: number) => {
  return fetchService
    .get<{ price: number; minQuantity: number }[]>({
      url: `product-price/for-user/${product_id}`,
    })
    .then((response) => {
      if (response.tokens) {
        cookies().then((cookieStore) => {
          updateTokensInAction(cookieStore, response.tokens);
        });
      }
      return response;
    });
};

export const fetchProductSpecifications = async (product_id: number) => {
  return fetchService
    .get<ProductSpecificationModel[]>({
      url: `product-specifications/product/${product_id}`,
    })
    .then((response) => {
      if (response.tokens) {
        cookies().then((cookieStore) => {
          updateTokensInAction(cookieStore, response.tokens);
        });
      }
      return response;
    });
};

export const fetchProductStocks = async (product_id: number) => {
  return fetchService
    .get<{ available: number; accounting: boolean }>({
      url: `product-stock/product-available/${product_id}`,
    })
    .then((response) => {
      if (response.tokens) {
        cookies().then((cookieStore) => {
          updateTokensInAction(cookieStore, response.tokens);
        });
      }
      return response;
    });
};

export const fetchProductQuestions = async (product_id: number, limit: string, page: string) => {
  return fetchService
    .get<{
      questions: QuestionModel[];
      totalCount: number;
      paginationPage: number;
    }>({
      url: `product-question/product/${product_id}`,
      params: { limit, page },
    })
    .then((response) => {
      if (response.tokens) {
        cookies().then((cookieStore) => {
          updateTokensInAction(cookieStore, response.tokens);
        });
      }
      return response;
    });
};
