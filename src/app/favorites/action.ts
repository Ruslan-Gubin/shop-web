import type { ProductModel } from "@/app/product/action";
import { fetchService } from "@/shared/fetch-api";

export const fetchFavoritesData = async (
  favoritesIds: string,
  recentIds: string,
  basketIds: string,
) => {
  return await fetchService.fetchChain<[ProductModel[], ProductModel[], ProductModel[]]>([
    {
      url: "product/by-ids",
      params: { ids: favoritesIds },
      tags: [`Favorites_${favoritesIds}`],
    },
    {
      url: "product/by-ids",
      params: { ids: recentIds },
      tags: [`Recent_${recentIds}`],
    },
    {
      url: "product/recommended",
      params: { favorite_ids: favoritesIds, viewed_ids: recentIds, cart_ids: basketIds, limit: "30" },
      tags: [`FavoritesRecommended_${favoritesIds}`],
    },
  ]);
};
