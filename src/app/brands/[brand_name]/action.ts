"use server";
import type { ProductModel } from "@/app/action";
import { fetchService } from "@/shared/fetch-api";

export const fetchBrandData = async (
  limit: string,
  page: string,
  brand_name: string,
  basketIds: string,
  recentIds: string,
  favoriteIds: string,
) => {
  return await fetchService.fetchChain<
    [
      { products: ProductModel[]; totalCount: number; paginationPage: string },
      ProductModel[],
      ProductModel[],
    ]
  >([
    {
      url: `product/brand/${brand_name}`,
      params: { limit, page, brand_name },
      tags: ["Brands"],
      revalidate: 30,
    },
    {
      url: "product/by-ids",
      params: { ids: recentIds },
      tags: [`Recent_${recentIds}`],
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
