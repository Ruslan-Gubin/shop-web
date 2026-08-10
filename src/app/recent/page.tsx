import { cookies } from "next/headers";
import { declOfNum } from "@/shared/helpers/declOfNum";
import { ErrorAlert } from "@/shared/ui/error-alert/ErrorAlert";
import { NotContent } from "@/shared/ui/not-content/NotContent";
import { PageHeader } from "@/shared/ui/page-header/PageHeader";
import { UpdateToken } from "@/views/UpdateToken/UpdateToken";
import { ProductList } from "@/widgets/product/ProductList/ProductList";
import { CarouselProducts } from "@/widgets/carousel-products/CarouselProducts";
import { fetchRecentData } from "./action";

export default async function RecentPage() {
  const cookieStore = await cookies();
  const recentItems = cookieStore.get("recent_items");
  const recentIds = recentItems?.value ? recentItems.value.replace("[", "").replace("]", "") : "";
  const favoritesItems = cookieStore.get("favorites_items");
  const favoriteIds = favoritesItems?.value
    ? Object.keys(JSON.parse(favoritesItems.value)).join(",")
    : "";
  const basketItems = cookieStore.get("basket_items");
  const basketIds = basketItems?.value ? Object.keys(JSON.parse(basketItems.value)).join(",") : "";

  const [recentData, recommendedData] = await fetchRecentData(recentIds, favoriteIds, basketIds);
  const recent = recentData.data || [];
  const recommended = recommendedData.data || [];

  const decString = declOfNum(recent.length, ["товар", "товара", "товаров"]);

  return (
    <section className="page-wrapper">
      {recentData?.tokens && <UpdateToken tokens={recentData.tokens} />}
      {recentData.status === "error" && recentData.message && (
        <ErrorAlert message={recentData.message} />
      )}
      {recommendedData.status === "error" && recommendedData.message && (
        <ErrorAlert message={recommendedData.message} />
      )}

      {recent.length > 0 ? (
        <>
          <PageHeader title="Вы смотрели" subtitle={`${recent.length} ${decString}`} />
          <ProductList variant="md" products={recent} />

          {recommended.length > 0 && (
            <section className="carousel-list">
              <CarouselProducts products={recommended} title="Подобрали для вас" />
            </section>
          )}
        </>
      ) : (
        <>
          <NotContent
            title="Вы еще не смотрели товары"
            subTitle="Сюда будут добавляться все товары которые вы просматривали ранее."
            href="/"
            buttonText="Перейти на главную"
          />
          {recommended.length > 0 && (
            <section className="carousel-list">
              <CarouselProducts products={recommended} title="Подобрали для вас" />
            </section>
          )}
        </>
      )}
    </section>
  );
}
