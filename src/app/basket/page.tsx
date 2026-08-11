import { cookies } from "next/headers";
import { ErrorAlert } from "@/shared/ui/error-alert/ErrorAlert";
import { UpdateToken } from "@/views/UpdateToken/UpdateToken";
import { CarouselProducts } from "@/widgets/carousel-products/CarouselProducts";
import { fetchBasketData, revalidateBasketAction } from "./action";
import { BasketWrapper } from "./components/BasketWrapper";

export default async function BasketPage() {
  const cookieStore = await cookies();
  const basketItems = cookieStore.get("basket_items");
  const basketIds = basketItems?.value ? Object.keys(JSON.parse(basketItems.value)).join(",") : "";
  const recentItems = cookieStore.get("recent_items");
  const recentIds = recentItems?.value ? recentItems.value.replace("[", "").replace("]", "") : "";
  const favoritesItems = cookieStore.get("favorites_items");
  const favoriteIds = favoritesItems?.value
    ? Object.keys(JSON.parse(favoritesItems.value)).join(",")
    : "";

  const [
    basketProductsData,
    cartDiscountsData,
    promotionsData,
    recentData,
    buyTogetherData,
    recommendedData,
  ] = await fetchBasketData(basketIds, recentIds, favoriteIds);

  const basketProducts = (basketProductsData.status === "success" && basketProductsData.data) || [];
  const cartDiscounts = (cartDiscountsData.status === "success" && cartDiscountsData.data) || [];
  const promotions = (promotionsData.status === "success" && promotionsData.data) || [];
  const recent = (recentData.status === "success" && recentData.data) || [];
  const buyTogether = (buyTogetherData.status === "success" && buyTogetherData.data) || [];
  const recommended = (recommendedData.status === "success" && recommendedData.data) || [];

  return (
    <section className="page-wrapper">
      {recentData?.tokens && <UpdateToken tokens={recentData.tokens} />}
      {promotionsData.status === "error" && promotionsData.message && (
        <ErrorAlert message={basketProductsData.message} />
      )}
      {cartDiscountsData.status === "error" && cartDiscountsData.message && (
        <ErrorAlert message={cartDiscountsData.message} />
      )}
      {promotionsData.status === "error" && promotionsData.message && (
        <ErrorAlert message={promotionsData.message} />
      )}
      {recentData.status === "error" && recentData.message && (
        <ErrorAlert message={recentData.message} />
      )}
      {buyTogetherData.status === "error" && buyTogetherData.message && (
        <ErrorAlert message={buyTogetherData.message} />
      )}
      {recommendedData.status === "error" && recommendedData.message && (
        <ErrorAlert message={recommendedData.message} />
      )}
      <BasketWrapper
        revalidateBasketAction={revalidateBasketAction}
        promotions={promotions}
        cartDiscounts={cartDiscounts}
        basketProducts={basketProducts}
      />

      <section className="carousel-list">
        {recent.length > 0 && (
          <CarouselProducts
            headerLink={recent.length > 6 ? { text: "Смотреть все", href: "/recent" } : undefined}
            products={recent}
            title="Вы недавно смотрели"
            revalidateBasketAction={revalidateBasketAction}
          />
        )}

        {basketProducts.length > 0 && buyTogether.length > 0 && (
          <CarouselProducts
            revalidateBasketAction={revalidateBasketAction}
            products={buyTogether}
            title="С этими товарами покупают"
          />
        )}

        {basketProducts.length === 0 && recommended.length > 0 && (
          <CarouselProducts
            revalidateBasketAction={revalidateBasketAction}
            products={recommended}
            title="Подобрали для вас"
          />
        )}
      </section>
    </section>
  );
}
