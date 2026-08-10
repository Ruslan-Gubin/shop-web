"use server";
import { cookies } from "next/headers";
import { CONFIG_APP } from "@/shared/config/config";
import { ErrorAlert } from "@/shared/ui/error-alert/ErrorAlert";
import type { AddressItem } from "@/stores/checkout/types";
import { UpdateToken } from "@/views/UpdateToken/UpdateToken";
import { CarouselProducts } from "@/widgets/carousel-products/CarouselProducts";
import { ProductSection } from "@/widgets/product/product-section/ProductSection";
import {
  checkingBalanceAction,
  createOrderAction,
  fetchCheckoutData,
  fetchForwardAction,
  fetchReverseAction,
} from "./action";
import { CheckoutWrapper } from "./components/CheckoutWrapper/CheckoutWrapper";

export default async function CheckoutPage() {
  const cookieStore = await cookies();
  const basketItems = cookieStore.get("basket_items");
  const basketIds = basketItems?.value ? Object.keys(JSON.parse(basketItems.value)).join(",") : "";
  const recentItems = cookieStore.get("recent_items");
  const recentIds = recentItems?.value ? recentItems.value.replace("[", "").replace("]", "") : "";
  const favoritesItems = cookieStore.get("favorites_items");
  const favoriteIds = favoritesItems?.value
    ? Object.keys(JSON.parse(favoritesItems.value)).join(",")
    : "";

  const [basketProductsData, cartDiscountsData, promotionsData, warehousesData, recentData, recommendedData] =
    await fetchCheckoutData(basketIds, recentIds, favoriteIds);

  const basketProducts = (basketProductsData.status === "success" && basketProductsData.data) || [];
  const cartDiscounts = (cartDiscountsData.status === "success" && cartDiscountsData.data) || [];
  const promotions = (promotionsData.status === "success" && promotionsData.data) || [];
  const warehouses = (warehousesData.status === "success" && warehousesData.data) || [];
  const recent = (recentData.status === "success" && recentData.data) || [];
  const recommended = (recommendedData.status === "success" && recommendedData.data) || [];

  const pickupAddress: AddressItem[] = warehouses.reduce<AddressItem[]>(
    (acc, el) => (el.address ? acc.concat(el.address) : acc),
    [],
  );

  const defaultWarehouse = warehouses.find((el) => el.default_warehouse);

  const defaultCenter = defaultWarehouse?.address
    ? { lng: defaultWarehouse.address.lng, lat: defaultWarehouse.address.lat }
    : { lng: 37.80358599891716, lat: 48.013597598505555 };

  return (
    <section className="page-wrapper">
      {promotionsData?.tokens && <UpdateToken tokens={promotionsData.tokens} />}
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
      {recommendedData.status === "error" && recommendedData.message && (
        <ErrorAlert message={recommendedData.message} />
      )}
      <CheckoutWrapper
        defaultCenter={defaultCenter}
        promotions={promotions}
        cartDiscounts={cartDiscounts}
        basketProducts={basketProducts}
        pickupAddress={pickupAddress}
        checkingBalanceAction={checkingBalanceAction}
        createOrderAction={createOrderAction}
        mapStyle={CONFIG_APP.MAPBOX_STYLE}
        mapToken={CONFIG_APP.MAPBOX_ACCESS_TOKEN}
        fetchReverseAction={fetchReverseAction}
        fetchForwardAction={fetchForwardAction}
      />

      <section className="carousel-list">
        {recent.length > 0 && (
          <CarouselProducts
            headerLink={recent.length > 6 ? { text: "Смотреть все", href: "/recent" } : undefined}
            products={recent}
            title="Вы недавно смотрели"
          />
        )}

        {recommended.length > 0 && (
          <ProductSection products={recommended} title="Подобрали для вас" />
        )}
      </section>
    </section>
  );
}
