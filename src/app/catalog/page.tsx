import { cookies } from "next/headers";
import { declOfNum } from "@/shared/helpers/declOfNum";
import { getIsLoadMoreDisabled } from "@/shared/helpers/getIsLoadMoreDisabled";
import { BreadCrumbs } from "@/shared/ui/breadcrumbs/BreadCrumbs";
import { ErrorAlert } from "@/shared/ui/error-alert/ErrorAlert";
import { PageHeader } from "@/shared/ui/page-header/PageHeader";
import { UpdateToken } from "@/views/UpdateToken/UpdateToken";
import { CarouselProducts } from "@/widgets/carousel-products/CarouselProducts";
import { fetchCatalogData } from "./action";
import styles from "./CatalogPage.module.css";
import { Filter } from "./Categories/Filter/Filter";
import { SimilarSearch } from "./Categories/SimilarSearch/SimilarSearch";
import { CatalogWrapper } from "./Categories/Wrapper/Wrapper";

export default async function CategoriesPage(req: {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
    sort?: string;
    price_from?: string;
    price_to?: string;
    specifications?: string;
    country?: string;
    product_types?: string;
  }>;
}) {
  const searchParams = await req.searchParams;
  const limit = 20;
  const patch = "/catalog";

  const cookieStore = await cookies();
  const recentItems = cookieStore.get("recent_items");
  const recentIds = recentItems?.value ? recentItems.value.replace("[", "").replace("]", "") : "";

  const [similarSearchData, recentData, categoryData, filtersData, catalogData] =
    await fetchCatalogData({
      limit: String(limit),
      category_id: searchParams.category,
      recentIds: recentIds,
      sort: searchParams.sort,
      page: searchParams.page,
      price_from: searchParams.price_from,
      price_to: searchParams.price_to,
      search: searchParams.search,
      specifications: searchParams.specifications,
      country: searchParams.country,
      product_types: searchParams.product_types,
    });

  const category = categoryData?.data?.categories || [];
  const childrenCategories = categoryData?.data?.childrenCategories || [];
  const products = catalogData.data?.products || [];
  const totalCount = catalogData.data?.totalCount || 0;
  const paginationPage = catalogData.data?.paginationPage;
  const recent = (recentData.status === "success" && recentData.data) || [];
  const similarSearch = similarSearchData.data || [];
  const filters = filtersData.data || null;

  const decString = declOfNum(totalCount, ["товар", "товара", "товаров"]);
  const findString = searchParams.search
    ? declOfNum(totalCount, ["найден", "найдено", "найдено"])
    : "";

  const breadcrumbs = [
    { label: "Главная", href: "/" },
    ...category.map((el, index) => ({
      label: el.name,
      href: index + 1 === category.length ? "" : `/catalog/?category=${el.id}`,
    })),
  ];

  const currentCategory = category.find((el) => el.id === Number(searchParams.category));
  const categoryName = category.length > 0 && currentCategory ? currentCategory.name : "";

  const isLoadMoreDisabled = getIsLoadMoreDisabled(paginationPage, totalCount, limit);
  const minPrice = filters?.price?.min || 1;
  const maxPrice = filters?.price?.max || 100000;

  const priceSettings = {
    activeFilterPrice: { from: searchParams.price_from || "", to: searchParams.price_to || "" },
    isActive:
      typeof searchParams.price_from === "string" &&
      typeof searchParams.price_to === "string" &&
      (Number(searchParams.price_from) !== minPrice || Number(searchParams.price_to) !== maxPrice),
    minPrice,
    maxPrice,
  };

  const mainCategoryId = category[0]?.id || 0;
  const selectCategoryId =
    category.length > 0 && currentCategory ? currentCategory.parent_id || 0 : 0;

  const mainCategory = categoryData.data?.transitionCategories.find(
    (el) => el.id === mainCategoryId,
  );

  const transitionCategories =
    categoryData.data?.transitionCategories && mainCategory ? [mainCategory] : [];

  const categoryValue = breadcrumbs.length > 2 ? breadcrumbs.at(-2)?.label || "" : "Категории";

  return (
    <section className={`page-wrapper ${styles.content}`}>
      {catalogData?.tokens && <UpdateToken tokens={catalogData.tokens} />}
      {recentData.status === "error" && recentData.message && (
        <ErrorAlert message={recentData.message} />
      )}
      {categoryData.status === "error" && categoryData.message && (
        <ErrorAlert message={categoryData.message} />
      )}
      {filtersData.status === "error" && filtersData.message && (
        <ErrorAlert message={filtersData.message} />
      )}
      {catalogData.status === "error" && catalogData.message && (
        <ErrorAlert message={catalogData.message} />
      )}
      {searchParams.category && <BreadCrumbs notShowBack breadcrumbs={breadcrumbs} />}
      <PageHeader
        title={searchParams.search ? searchParams.search : categoryName}
        subtitle={totalCount > 0 ? `${totalCount} ${decString} ${findString}` : "товары не найдены"}
      />

      {searchParams.search && similarSearch.length > 0 && (
        <SimilarSearch similarSearch={similarSearch} />
      )}

      {childrenCategories.length === 0 && (
        <Filter
          filters={filters}
          searchParams={searchParams}
          mainCategory={mainCategory || null}
          selectCategoryId={selectCategoryId}
          categoryValue={categoryValue}
          categories={transitionCategories}
          priceSettings={priceSettings}
        />
      )}

      <CatalogWrapper
        limit={limit}
        total={totalCount}
        patch={patch}
        isLoadMoreDisabled={isLoadMoreDisabled}
        searchParams={searchParams}
        products={products}
        categories={childrenCategories}
      />

      <section className="carousel-list">
        {recent.length > 0 && (
          <CarouselProducts
            headerLink={recent.length > 6 ? { text: "Смотреть все", href: "/recent" } : undefined}
            products={recent}
            title="Вы недавно смотрели"
          />
        )}
      </section>
    </section>
  );
}
