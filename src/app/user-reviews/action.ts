import type { ProductModel, UserModel } from "@/app/action";
import type { ReviewModel } from "@/app/catalog/detail/[id]/action";
import { fetchService } from "@/shared/fetch-api";
import { USER_REVIEWS_TAB_SOURCES } from "./helpers/url";
import type {
  UserProductQuestionsResponse,
  UserReviewsListResponse,
  UserReviewsViewFlag,
} from "./types";

type PriceItem = { price: number; minQuantity: number };
type StockItem = { available: number; accounting: boolean };

export const fetchUserReviewsData = async (
  view: UserReviewsViewFlag,
  page: string,
  limit: number,
) => {
  const [productsData, userData] = await fetchService.fetchChain<
    [UserReviewsListResponse, UserModel]
  >([
    {
      url: USER_REVIEWS_TAB_SOURCES[view],
      params: {
        limit: String(limit),
        page,
      },
    },
    {
      url: "users/me",
    },
  ]);

  const ids = (productsData.data?.products || [])
    .map((product) => product.id)
    .join(",");

  const productsOriginData =
    ids.length > 0
      ? await fetchService.get<ProductModel[]>({
          url: "product/by-ids",
          params: { ids },
          updateToken: userData.tokens,
        })
      : null;

  return { productsData, userData, productsOriginData };
};

export const fetchUserProductReviewData = async (product_id: string) =>
  fetchService.fetchChain<
    [ProductModel, PriceItem[], StockItem, ReviewModel | null, UserModel]
  >([
    {
      url: `product/${product_id}`,
    },
    {
      url: `product-price/for-user/${product_id}`,
    },
    {
      url: `product-stock/product-available/${product_id}`,
    },
    {
      url: `product-review/my/${product_id}`,
    },
    {
      url: "users/me",
    },
  ]);

export const fetchUserProductQuestionsData = async (
  product_id: string,
  page: string,
  limit: number,
) =>
  fetchService.fetchChain<
    [
      ProductModel,
      PriceItem[],
      StockItem,
      UserProductQuestionsResponse,
      UserModel,
    ]
  >([
    {
      url: `product/${product_id}`,
    },
    {
      url: `product-price/for-user/${product_id}`,
    },
    {
      url: `product-stock/product-available/${product_id}`,
    },
    {
      url: `product-question/my-questions-from-product/${product_id}`,
      params: {
        limit: String(limit),
        page,
      },
    },
    {
      url: "users/me",
    },
  ]);
