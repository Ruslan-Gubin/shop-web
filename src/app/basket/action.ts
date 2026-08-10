import type { ProductModel, PromotionModel } from "@/app/action";
import { fetchService } from "@/shared/fetch-api";
import type { CartDiscountModel } from "../cart-discounts/action";

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
      url: "product/by-ids",
      params: { ids: recentIds },
      tags: [`Recent_${recentIds}`],
    },
    {
      url: "product/buy-together",
      params: { ids: basketIds },
      tags: [`BasketBuyTogether_${basketIds}`],
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
    },
  ]);
};
