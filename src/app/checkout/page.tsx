"use server";
import type { Position } from "geojson";
import { cookies } from "next/headers";
import { CONFIG_APP } from "@/shared/config/config";
import { getDefaultCenterMap } from "@/shared/helpers/getDefaultCenterMap";
import type { AddressItem } from "@/stores/checkout/types";
import { ErrorList } from "@/views/error-list/ErrorList";
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

  const [
    basketProductsData,
    cartDiscountsData,
    promotionsData,
    warehousesData,
    recentData,
    recommendedData,
    sectorsData,
    userData,
  ] = await fetchCheckoutData(basketIds, recentIds, favoriteIds);

  const basketProducts = (basketProductsData.status === "success" && basketProductsData.data) || [];
  const cartDiscounts = (cartDiscountsData.status === "success" && cartDiscountsData.data) || [];
  const promotions = (promotionsData.status === "success" && promotionsData.data) || [];
  const warehouses = (warehousesData.status === "success" && warehousesData.data) || [];
  const recent = (recentData.status === "success" && recentData.data) || [];
  const recommended = (recommendedData.status === "success" && recommendedData.data) || [];
  const user = userData.data;
  const isDeliveryCourier = Array.isArray(sectorsData.data) && sectorsData.data.length > 0;

  const sectors =
    Array.isArray(sectorsData.data) && sectorsData.data.length > 0
      ? {
          type: "FeatureCollection",
          features: sectorsData.data.map((sector) => ({
            type: "Feature",
            properties: {
              id: sector.id,
              color: sector.color,
              price: sector.price,
              min_sum: sector.min_sum,
            },
            geometry: { type: "Polygon", coordinates: [sector.coordinates as Position[]] },
          })),
        }
      : { type: "FeatureCollection", features: [] };

  const pickupAddress: AddressItem[] = warehouses.reduce<AddressItem[]>(
    (acc, el) => (el.address ? acc.concat(el.address) : acc),
    [],
  );

  const defaultPickupCenter = getDefaultCenterMap(warehouses);
  const hasFindDefaultCenterMap = defaultPickupCenter.lat > 0 && defaultPickupCenter.lng > 0;

  const defaultCenter = {
    lng: hasFindDefaultCenterMap ? defaultPickupCenter.lng : 37.80358599891716,
    lat: hasFindDefaultCenterMap ? defaultPickupCenter.lat : 48.013597598505555,
  };

  return (
    <section className="page-wrapper">
      {userData?.tokens && <UpdateToken tokens={userData.tokens} />}
      <ErrorList
        errorsList={[
          basketProductsData,
          cartDiscountsData,
          promotionsData,
          warehousesData,
          recentData,
          recommendedData,
          sectorsData,
        ]}
      />
      <CheckoutWrapper
        sectors={sectors}
        isRegister={user !== null}
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
        isDeliveryCourier={isDeliveryCourier}
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
