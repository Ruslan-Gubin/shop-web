import { fetchService } from "@/shared/fetch-api";
import type { ProductModel, UserModel } from "../action";

export const fetchProfileData = async (
  recentIds: string,
  favoriteIds: string,
  basketIds: string,
) => {
  return await fetchService.fetchChain<
    [
      ProductModel[],
      ProductModel[],
      {
        orders: number;
        purchases: number;
        waiting: number;
      },
      UserModel,
    ]
  >([
    {
      url: "product/by-ids",
      params: { ids: recentIds },
      tags: [`Recent_${recentIds}`],
    },
    {
      url: "product/recommended",
      params: {
        favorite_ids: favoriteIds,
        cart_ids: basketIds,
        viewed_ids: recentIds,
        limit: "30",
      },
      tags: [`ProfileRecommended_${recentIds}`],
    },
    {
      url: "orders/order-client-counts",
      tags: ["ProfileData"],
    },
    {
      url: "users/me",
      tags: ["ProfileData"],
    },
  ]);
};
