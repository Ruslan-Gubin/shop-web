import { fetchService } from "@/shared/fetch-api";
import type { ReviewModel } from "../../catalog/detail/[id]/action";
import type { ProductModel } from "../../product/action";

export type CanReviewData = boolean;
export type MyReviewData = ReviewModel | null;

export const fetchReviewsData = async (product_id: string, limit: number, page?: string) => {
  return await fetchService.fetchChain<
    [
      { available: number; accounting: boolean },
      { price: number; minQuantity: number }[],
      ProductModel,
      CanReviewData,
      MyReviewData,
      { reviews: ReviewModel[]; totalCount: number; paginationPage: number },
    ]
  >([
    {
      url: `product-stock/product-available/${product_id}`,
      tags: [`ProductStocks_${product_id}`],
    },
    {
      url: `product-price/for-user/${product_id}`,
      tags: [`ProductPrices_${product_id}`],
    },
    {
      url: `product/${product_id}`,
      tags: [`Product_${product_id}`],
    },
    {
      url: `product-review/can-review/${product_id}`,
      tags: [`CanReview_${product_id}`],
    },
    {
      url: `product-review/my/${product_id}`,
      tags: [`ReviewMy_${product_id}`],
    },
    {
      url: `product-review/product/${product_id}`,
      params: { page: page || "1", limit: String(limit) },
      tags: [`Reviews_${product_id}`],
    },
  ]);
};
