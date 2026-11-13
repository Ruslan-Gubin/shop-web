"use server";
import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import {
  type CategoryModel,
  fetchProduct,
  type ProductModel,
  type ProductSpecificationModel,
  UserModel,
} from "@/app/action";
import type { CustomMetadata } from "@/app/core/getMetadata";
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
      UserModel,
    ]
  >([
    {
      url: `product/can-review/${product_id}`,
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
    {
      url: "users/me",
      tags: ["ProfileData"],
    },
  ]);
};

export const getMetadataProductDetail = async (req: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> => {
  const params = await req.params;

  const updateMetadata: CustomMetadata = {
    title: `Товар №${params.id || ""} — Интернет‑магазин`,
    description:
      "Интернет‑магазин: характеристики, фото, отзывы, вопросы к товару, цена и наличие товаров.",
  };

  if (params.id) {
    await fetchProduct(params.id).then((response) => {
      if (response.status === "success" && response.data) {
        updateMetadata.title = response.data?.seo_title || response.data.name;
        updateMetadata.description = response.data?.seo_description || response.data.description;

        if (response.data?.og_title.length > 0) {
          updateMetadata.og_title = response.data.og_title;
        }

        if (response.data?.og_description.length > 0) {
          updateMetadata.og_description = response.data.og_description;
        }

        if (response.data.photos.length > 0) {
          const firstImg = response.data.photos[0];
          if (firstImg && firstImg.url.length > 0) {
            updateMetadata.image = firstImg.url;
          }
        }
      }
    });
  }

  return updateMetadata;
};

export const createQuestionAction = async (question: string, product_id: string) => {
  const cookieStore = await cookies();
  const headersList = await headers();
  const referer = headersList.get("referer") || "";

  return fetchService
    .post<QuestionModel>({
      url: "product-question/create",
      payload: { question, product_id: Number(product_id) },
    })
    .then((response) => {
      if (response.tokens) {
        updateTokensInAction(cookieStore, response.tokens);
      }

      if (response.status === "success" && referer) {
        revalidatePath(new URL(referer).pathname);
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
