import { cookies } from "next/headers";
import { declOfNum } from "@/shared/helpers/declOfNum";
import { ErrorAlert } from "@/shared/ui/error-alert/ErrorAlert";
import { NotContent } from "@/shared/ui/not-content/NotContent";
import { PageHeader } from "@/shared/ui/page-header/PageHeader";
import { UpdateToken } from "@/views/UpdateToken/UpdateToken";
import { CarouselProducts } from "@/widgets/carousel-products/CarouselProducts";
import { ProductList } from "@/widgets/product/ProductList/ProductList";
import { ProductSection } from "@/widgets/product/product-section/ProductSection";
import { fetchFavoritesData } from "./action";

export default async function FavoritesPage() {
  const cookieStore = await cookies();

  const favoritesItems = cookieStore.get("favorites_items");
  const favoritesIds = favoritesItems?.value
    ? Object.keys(JSON.parse(favoritesItems.value)).join(",")
    : "";

  const recentItems = cookieStore.get("recent_items");
  const recentIds = recentItems?.value ? recentItems.value.replace("[", "").replace("]", "") : "";
  const basketItems = cookieStore.get("basket_items");
  const basketIds = basketItems?.value ? Object.keys(JSON.parse(basketItems.value)).join(",") : "";

  const [favoritesData, recentData, recommendedData] = await fetchFavoritesData(
    favoritesIds,
    recentIds,
    basketIds,
  );

  const favorites = favoritesData.data || [];
  const recent = recentData.data || [];
  const recommended = recommendedData.data || [];

  const decString = declOfNum(favorites.length, ["товар", "товара", "товаров"]);

  return (
    <section className="page-wrapper">
      {recentData?.tokens && <UpdateToken tokens={recentData.tokens} />}
      {favoritesData.status === "error" && favoritesData.message && (
        <ErrorAlert message={favoritesData.message} />
      )}
      {recentData.status === "error" && recentData.message && (
        <ErrorAlert message={recentData.message} />
      )}
      {recommendedData.status === "error" && recommendedData.message && (
        <ErrorAlert message={recommendedData.message} />
      )}

      {favorites.length > 0 ? (
        <>
          <PageHeader title="Избранное" subtitle={`${favorites.length} ${decString}`} />
          <ProductList variant="md" products={favorites} />
        </>
      ) : (
        <>
          <NotContent
            title="В избранном пока пусто"
            subTitle="Добавляйте сюда всё, что понравилось. Так не придётся долго искать, когда захотите посмотреть или купить."
            href="/"
            buttonText="Перейти на главную"
          />
          <section className="carousel-list">
            {recent.length > 0 && (
              <CarouselProducts
                headerLink={
                  recent.length > 6 ? { text: "Смотреть все", href: "/recent" } : undefined
                }
                products={recent}
                title="Вы недавно смотрели"
              />
            )}

            {recommended.length > 0 && (
              <ProductSection products={recommended} title="Подобрали для вас" />
            )}
          </section>
        </>
      )}
    </section>
  );
}
