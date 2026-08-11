import { cookies } from "next/headers";
import { CatalogProducts } from "@/app/catalog/Categories/Products/Products";
import { declOfNum } from "@/shared/helpers/declOfNum";
import { getDecodeBrandName } from "@/shared/helpers/getDecodeBrandName";
import { getIsLoadMoreDisabled } from "@/shared/helpers/getIsLoadMoreDisabled";
import { ErrorAlert } from "@/shared/ui/error-alert/ErrorAlert";
import { NotContent } from "@/shared/ui/not-content/NotContent";
import { PageHeader } from "@/shared/ui/page-header/PageHeader";
import { UpdateToken } from "@/views/UpdateToken/UpdateToken";
import { CarouselProducts } from "@/widgets/carousel-products/CarouselProducts";
import { fetchBrandData } from "./action";

export default async function BrandsPage(req: {
  searchParams: Promise<{ page: string }>;
  params: Promise<{ brand_name: string }>;
}) {
  const cookieStore = await cookies();
  const limit = 30;
  const searchParams = await req.searchParams;
  const params = await req.params;

  const brand_name = getDecodeBrandName(params.brand_name);

  const patch = `/brands/${brand_name}`;

  const basketItems = cookieStore.get("basket_items");
  const basketIds = basketItems?.value ? Object.keys(JSON.parse(basketItems.value)).join(",") : "";
  const recentItems = cookieStore.get("recent_items");
  const recentIds = recentItems?.value ? recentItems.value.replace("[", "").replace("]", "") : "";
  const favoritesItems = cookieStore.get("favorites_items");
  const favoriteIds = favoritesItems?.value
    ? Object.keys(JSON.parse(favoritesItems.value)).join(",")
    : "";

  const [brandProductsData, recentData, recommendedData] = await fetchBrandData(
    String(limit),
    searchParams.page || "1",
    brand_name,
    basketIds,
    recentIds,
    favoriteIds,
  );

  const brandProducts =
    (brandProductsData.status === "success" && brandProductsData.data?.products) || [];
  const recent =
    (recentData.status === "success" &&
      recentData.data &&
      recentData.data.filter((el) => el.brand_name !== brand_name)) ||
    [];
  const recommended = (recommendedData.status === "success" && recommendedData.data) || [];

  const paginationPage = brandProductsData.data?.paginationPage;
  const totalCount = brandProductsData.data?.totalCount || 0;
  const products = brandProductsData.data?.products || [];

  const isLoadMoreDisabled = getIsLoadMoreDisabled(paginationPage, totalCount, limit);

  const decString = declOfNum(totalCount, ["товар", "товара", "товаров"]);

  return (
    <section className="page-wrapper">
      {recommendedData?.tokens && <UpdateToken tokens={recommendedData.tokens} />}

      {brand_name.length > 0 && (
        <PageHeader title={brand_name} subtitle={`${totalCount} ${decString}`} />
      )}

      {brandProductsData.status === "error" && brandProductsData.message && (
        <ErrorAlert message={brandProductsData.message} />
      )}
      {recentData.status === "error" && recentData.message && (
        <ErrorAlert message={recentData.message} />
      )}
      {recommendedData.status === "error" && recommendedData.message && (
        <ErrorAlert message={recommendedData.message} />
      )}

      {products.length > 0 ? (
        <CatalogProducts
          key={patch}
          limit={limit}
          total={totalCount}
          patch={patch}
          isLoadMoreDisabled={isLoadMoreDisabled}
          searchParams={searchParams}
          products={products}
          showFullWidth={true}
          isHomePage
        />
      ) : (
        <NotContent
          title="Не найдены товары этого бренда"
          subTitle="Перейдите на главную и выберите товар с брендом, который вас интересует."
          href="/"
          buttonText="Перейти на главную"
        />
      )}

      <section className="carousel-list">
        {recent.length > 0 && (
          <CarouselProducts
            headerLink={recent.length > 6 ? { text: "Смотреть все", href: "/recent" } : undefined}
            products={recent}
            title="Вы недавно смотрели"
          />
        )}

        {brandProducts.length === 0 && recommended.length > 0 && (
          <CarouselProducts products={recommended} title="Подобрали для вас" />
        )}
      </section>
    </section>
  );
}
