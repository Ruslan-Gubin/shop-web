"use server";
import { cookies } from "next/headers";
import { fetchService } from "@/shared/fetch-api";
import { updateTokensInAction } from "@/shared/helpers/updateCookieAction";

export type PhotoModel = {
  created_at: string;
  id: number;
  parent_id: number;
  parent_type: string;
  position: number;
  updated_at: string;
  url: string;
};

export interface ProductModel {
  id: number;
  name: string;
  code: string;
  brand_id: number;
  brand_name: string;
  category_id: number;
  description: string;
  country: string;
  product_type: string;
  equipment: string;
  weight: number;
  height: number;
  length: number;
  width: number;
  purchase_price: number;
  available: number;
  accounting: boolean;
  price_list: { price: number; minQuantity: number }[];
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string | null;
  photos: PhotoModel[];
  keywords: string;
  og_description: string;
  og_title: string;
  og_type: string;
  seo_description: string;
  seo_title: string;
  slug: string;
}

export interface ProductPriceModel {
  id: number;
  product_id: number;
  price_type_id: number;
  price: number;
  created_at: string;
  updated_at: string | null;
}

export const fetchProductsMainPage = async (limit: number, page?: string) => {
  return await fetchService.get<{
    paginationPage: string;
    products: ProductModel[];
    totalCount: number;
  }>({
    url: "product/main-page",
    params: {
      limit: String(limit),
      page: page ? String(page) : "1",
    },
    tags: ["Products"],
  });
};

export const fetchProduct = async (id: string) => {
  const cookieStore = await cookies();

  return await fetchService
    .get<ProductModel>({
      url: `product/${id}`,
      tags: [`Products_${id}`],
    })
    .then((response) => {
      if (response.tokens) {
        updateTokensInAction(cookieStore, response.tokens);
      }
      return response;
    });
};
