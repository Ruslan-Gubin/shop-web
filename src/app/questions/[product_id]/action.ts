import type { ProductModel } from "@/app/action";
import { fetchService } from "@/shared/fetch-api";
import type { QuestionModel } from "../../catalog/detail/[id]/action";

export const fetchQuestionsData = async (product_id: string, limit: number, page?: string) => {
  return await fetchService.fetchChain<
    [
      { available: number; accounting: boolean },
      { price: number; minQuantity: number }[],
      ProductModel,
      { questions: QuestionModel[]; totalCount: number; paginationPage: number },
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
      url: `product-question/product/${product_id}`,
      params: { page: page || "1", limit: String(limit) },
      tags: [`Questions_${product_id}`],
    },
  ]);
};
