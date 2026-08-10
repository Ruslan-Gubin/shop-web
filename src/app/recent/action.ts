import type { ProductModel } from "@/app/action";
import { fetchService } from "@/shared/fetch-api";

export const fetchRecentData = async (
  recentIds: string,
  favoriteIds: string,
  basketIds: string,
) => {
  return await fetchService.fetchChain<[ProductModel[], ProductModel[]]>([
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
      tags: [`RecentRecommended_${recentIds}`],
    },
  ]);
};
