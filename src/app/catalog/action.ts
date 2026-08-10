import { fetchService } from "@/shared/fetch-api";
import type { ProductModel } from "../action";
import type { CategoryModel } from "../category/action";

export type SearchModel = {
  id: number;
  text: string;
  result_count: number;
  views: number;
  created_at: string;
  updated_at: string | null;
};

export type CatalogFiltersResponse = {
  price: { min: number; max: number };
  specifications: { id: number; name: string; type: string; values: string[] }[];
  countries: string[];
  product_types: string[];
};

export const fetchCatalogData = async ({
  category_id,
  search,
  recentIds,
  limit,
  sort,
  page,
  price_from,
  price_to,
  specifications,
  country,
  product_types,
}: {
  category_id?: string;
  search?: string;
  recentIds: string;
  limit: string;
  sort?: string;
  page?: string;
  price_from?: string;
  price_to?: string;
  specifications?: string;
  country?: string;
  product_types?: string;
}) => {
  const searchParams: { text?: string; limit: string } = {
    limit: "7",
  };

  const filterParams: {
    category_id?: string;
    search?: string;
    price_from?: string;
    price_to?: string;
  } = {};

  const catalogParams: {
    limit: string;
    category_id?: string;
    search?: string;
    page: string;
    price_from?: string;
    price_to?: string;
    sort?: string;
    specifications?: string;
    country?: string;
    product_types?: string;
  } = {
    page: page || "1",
    limit,
  };

  if (category_id) {
    catalogParams.category_id = category_id;
    filterParams.category_id = category_id;
  }

  if (search) {
    catalogParams.search = search;
    searchParams.text = search;
    filterParams.search = search;
  }

  if (sort) {
    catalogParams.sort = sort;
  }

  if (price_from) {
    catalogParams.price_from = price_from;
    filterParams.price_from = price_from;
  }

  if (price_to) {
    catalogParams.price_to = price_to;
    filterParams.price_to = price_to;
  }

  if (specifications) {
    catalogParams.specifications = specifications;
  }

  if (country) {
    catalogParams.country = country;
  }

  if (product_types) {
    catalogParams.product_types = product_types;
  }

  return await fetchService.fetchChain<
    [
      SearchModel[],
      ProductModel[],
      {
        categories: CategoryModel[];
        childrenCategories: CategoryModel[];
        transitionCategories: CategoryModel[];
      },
      CatalogFiltersResponse,
      { products: ProductModel[]; totalCount: number; paginationPage: string },
    ]
  >([
    {
      url: "search",
      params: searchParams,
      tags: [`Search_${search}`],
    },
    {
      url: "product/by-ids",
      params: { ids: recentIds },
      tags: [`Recent_${recentIds}`],
    },
    {
      url: `category/fullPathCategories/${category_id}`,
      tags: [`Category_${category_id}`],
    },
    {
      url: "product/filters",
      params: filterParams,
      tags: [`CATALOG_${category_id}_${search}_${price_from}_${price_to}`],
    },
    {
      url: "product/catalog",
      params: catalogParams,
      tags: [`CATALOG_${category_id}_${search}_${sort}_${price_from}_${price_to}`],
    },
  ]);
};
