"use server";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import type { CategoryModel } from "@/app/category/action";
import type { ProductModel } from "@/app/product/action";
import type { ProductSpecificationModel } from "@/app/specifications/action";
import { fetchService } from "@/shared/fetch-api";
import { updateTokensInAction } from "@/shared/helpers/updateCookieAction";
import { getValidatePayload } from "@/shared/services/get-form-action-state";
import { setErrorFromServer } from "@/shared/services/set-new-store-error-from-server";
import { createReviewSchema } from "./schema";

export type ReviewModel = {
  id: number;
  create_user_id: number;
  dignities: string; // Достоинства
  disadvantages: string; // Недостатки
  rating: number;
  answer: string;
  comment: string;
  created_at: string;
  update_at: string | null;
  product?: ProductModel;
};

export type QuestionModel = {
  id: number;
  create_user_id: number;
  question: string;
  answer: string;
  created_at: string;
  update_at: string | null;
  product: { id: number };
};

export const fetchProductDetail = async (
  product_id: string,
  recentIds: string,
  allRecentIds: string,
  favorite_ids: string,
  cart_ids: string,
) => {
  return await fetchService.fetchChain<
    [
      boolean,
      ReviewModel | null,
      { reviews: ReviewModel[]; totalCount: number; paginationPage: number },
      { questions: QuestionModel[]; totalCount: number; paginationPage: number },
      ProductModel[],
      ProductModel[],
      ProductModel[],
      ProductModel[],
      CategoryModel[],
      ProductModel,
      { price: number; minQuantity: number }[],
      ProductSpecificationModel[],
      { available: number; accounting: boolean },
    ]
  >([
    {
      url: `product-review/can-review/${product_id}`,
      tags: [`CanReview_${product_id}`],
    },
    {
      url: `product-review/my/${product_id}`,
      tags: [`ReviewMy_${product_id}`],
      revalidate: 10,
    },
    {
      url: `product-review/product/${product_id}`,
      params: { page: "1", limit: "30" },
      tags: [`Reviews_${product_id}`],
      revalidate: 10,
    },
    {
      url: `product-question/product/${product_id}`,
      params: { page: "1", limit: "30" },
      tags: [`Questions_${product_id}`],
    },
    {
      url: "product/recommended",
      params: { favorite_ids, cart_ids, viewed_ids: allRecentIds, limit: "30" },
      tags: [`Recommended_${favorite_ids}`],
    },
    {
      url: "product/by-ids",
      params: { ids: recentIds },
      tags: [`Recent_${recentIds}`],
    },
    {
      url: "product/buy-together",
      params: { ids: `${product_id}` },
      tags: [`ProductBuyTogether_${product_id}`],
    },
    {
      url: `product/similar/${product_id}`,
      tags: [`ProductSimilar_${product_id}`],
    },
    {
      url: `product/full-path-categories/${product_id}`,
      tags: [`ProductCategories_${product_id}`],
    },
    {
      url: `product/increment-view/${product_id}`,
      tags: [`Product_${product_id}`],
    },
    {
      url: `product-price/for-user/${product_id}`,
      tags: [`ProductPrices_${product_id}`],
    },
    {
      url: `product-specifications/product/${product_id}`,
      tags: [`ProductSpecifications_${product_id}`],
    },
    {
      url: `product-stock/product-available/${product_id}`,
      tags: [`ProductStocks_${product_id}`],
    },
  ]);
};

export const createQuestionAction = async (question: string, product_id: string) => {
  const cookieStore = await cookies();

  return fetchService
    .post<QuestionModel>({
      url: "product-question/create",
      payload: { question, product_id: Number(product_id) },
    })
    .then((response) => {
      if (response.tokens) {
        updateTokensInAction(cookieStore, response.tokens);
      }

      return response;
    });
};

export type CreateReviewPayload = {
  comment: string;
  dignities: string;
  disadvantages: string;
  rating: number;
  product_id: string;
};

export const createReviewAction = async (payload: CreateReviewPayload) => {
  const { isValid, errors } = getValidatePayload(payload, createReviewSchema);

  if (isValid) {
    const cookieStore = await cookies();
    const headersList = await headers();
    const referer = headersList.get("referer") || "";
    const path = new URL(referer).pathname;

    return fetchService
      .post<ReviewModel>({
        url: "product-review/create",
        payload: { ...payload, product_id: Number(payload.product_id) },
      })
      .then((response) => {
        if (response.tokens) {
          updateTokensInAction(cookieStore, response.tokens);
        }

        if (response.status === "error" && response.errors) {
          setErrorFromServer(response.errors, errors);
        }

        if (response.status === "success" && path) {
          revalidatePath(path);
        }

        return { status: response.status, errors, data: response.data, message: response.message };
      });
  } else {
    return { status: "error", errors, data: null, message: "" };
  }
};

export type EditReviewPayload = {
  comment: string;
  dignities: string;
  disadvantages: string;
  rating: number;
};

export const editReviewAction = async (review_id: number, payload: EditReviewPayload) => {
  const { isValid, errors } = getValidatePayload(payload, createReviewSchema);

  if (isValid) {
    const cookieStore = await cookies();
    const headersList = await headers();
    const referer = headersList.get("referer") || "";
    const path = new URL(referer).pathname;

    return fetchService
      .patch<null>({
        url: `product-review/${review_id}`,
        payload,
      })
      .then((response) => {
        if (response.tokens) {
          updateTokensInAction(cookieStore, response.tokens);
        }

        if (response.status === "error" && response.errors) {
          setErrorFromServer(response.errors, errors);
        }

        if (response.status === "success" && path) {
          revalidatePath(path);
        }

        return { status: response.status, errors, data: response.data, message: response.message };
      });
  } else {
    return { status: "error", errors, data: null, message: "" };
  }
};

export const deleteReviewAction = async (review_id: number) => {
  const cookieStore = await cookies();
  const headersList = await headers();
  const referer = headersList.get("referer") || "";
  const path = new URL(referer).pathname;

  return fetchService
    .delete<null>({
      url: `product-review/${review_id}`,
    })
    .then((response) => {
      if (response.tokens) {
        updateTokensInAction(cookieStore, response.tokens);
      }

      if (response.status === "success" && path) {
        revalidatePath(path);
      }

      return response;
    });
};
