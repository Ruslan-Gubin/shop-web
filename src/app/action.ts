"use server";
import { cookies } from "next/headers";
import { CONFIG_APP } from "@/shared/config/config";
import { fetchService } from "@/shared/fetch-api";
import { updateTokensInAction } from "@/shared/helpers/updateCookieAction";
import type { SearchModel } from "./catalog/action";
import type { QuestionModel } from "./catalog/detail/[id]/action";
import type { ProductSpecificationModel } from "./specifications/action";

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
