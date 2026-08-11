"use server";
import { revalidatePath } from "next/cache";
import type { CartDiscountModel, ProductModel, PromotionModel } from "@/app/action";
import { fetchService } from "@/shared/fetch-api";

export const revalidateBasketAction = async () => {
  revalidatePath("/basket", "page");
};

export const fetchBasketData = async (
  basketIds: string,
  recentIds: string,
  favoriteIds: string,
) => {
  return await fetchService.fetchChain<
    [
      ProductModel[],
      CartDiscountModel[],
      PromotionModel[],
      ProductModel[],
      ProductModel[],
      ProductModel[],
    ]
  >([
    {
      url: "product/by-ids",
      params: { ids: basketIds },
      tags: [`Basket`],
      revalidate: 30,
    },
    {
      url: "cart-discounts/active",
      tags: ["CartDiscounts"],
      revalidate: 30,
    },
    {
      url: "promotions/active",
      tags: ["Promotions"],
      revalidate: 30,
    },
    {
      url: "product/by-ids",
      params: { ids: recentIds },
      tags: [`Recent_${recentIds}`],
      revalidate: 30,
    },
    {
      url: "product/buy-together",
      params: { ids: basketIds },
      tags: [`BasketBuyTogether_${basketIds}`],
      revalidate: 30,
    },
    {
      url: "product/recommended",
      params: {
        favorite_ids: favoriteIds,
        cart_ids: basketIds,
        viewed_ids: recentIds,
        limit: "30",
      },
      tags: [`BasketRecommended_${basketIds}`],
      revalidate: 30,
    },
  ]);
};
