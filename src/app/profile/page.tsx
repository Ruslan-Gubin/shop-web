import { cookies } from "next/headers";
import { declOfNum } from "@/shared/helpers/declOfNum";
import { getPhoneDisplay } from "@/shared/helpers/getFormattedPhone";
import { ErrorAlert } from "@/shared/ui/error-alert/ErrorAlert";
import { NotContent } from "@/shared/ui/not-content/NotContent";
import { UpdateToken } from "@/views/UpdateToken/UpdateToken";
import { CarouselProducts } from "@/widgets/carousel-products/CarouselProducts";
import { fetchProfileData } from "./action";
import { ProfileContent } from "./components/ProfileContent/ProfileContent";

export default async function ProfilePage() {
  const cookieStore = await cookies();

  const recentItems = cookieStore.get("recent_items");
  const recentIds = recentItems?.value ? recentItems.value.replace("[", "").replace("]", "") : "";

  const basketItems = cookieStore.get("basket_items");
  const basketIds = basketItems?.value ? Object.keys(JSON.parse(basketItems.value)).join(",") : "";

  const favoritesItems = cookieStore.get("favorites_items");
  const favoriteIds = favoritesItems?.value
    ? Object.keys(JSON.parse(favoritesItems.value)).join(",")
    : "";
  const favoritesCount =
    favoritesItems && favoritesItems.value.length > 0
      ? Object.keys(JSON.parse(favoritesItems?.value)).length
      : 0;
  const favoritesValue =
    favoritesCount > 0
      ? `${favoritesCount} ${declOfNum(favoritesCount, ["товар", "товара", "товаров"])}`
      : "Нет товаров";

  const [recentData, recommendedData, countsData, userData] = await fetchProfileData(
    recentIds,
    favoriteIds,
    basketIds,
  );

  const recent = recentData.data || [];
  const recommended = recommendedData.data || [];
  const counts = countsData.data;
  const phone = userData?.data ? userData.data?.phone : "";

  const navigateList = [
    {
      label: "Заказы",
      value:
        counts && counts.orders > 0
          ? `${counts.orders} ${declOfNum(counts.orders, ["заказ", "заказа", "заказов"])}`
          : "Ближайшие: не ожидаются",
      href: "orders/all",
    },
    {
      label: "Покупки",
      value:
        counts && counts.purchases > 0
          ? `Купили ${counts.purchases} раз`
          : "Здесь можно купить что-то заново",
      href: "orders/purchases",
    },
    {
      label: "Лист ожидания",
      value:
        counts && counts.waiting > 0
          ? `Ожидается ${counts.waiting} ${declOfNum(counts.waiting, ["заказ", "заказа", "заказов"])}`
          : "Нет ожидания",
      href: "orders/waiting",
    },
    { label: "Избранное", value: favoritesValue, href: "favorites" },
    {
      label: "Отзывы и вопросы",
      value: "Делитесь мнением и узнавайте о товарах",
      href: "user-reviews",
    },
  ];

  return (
    <section className="page-wrapper">
      {userData?.tokens && <UpdateToken tokens={userData.tokens} />}
      {recentData.status === "error" && recentData.message && (
        <ErrorAlert message={recentData.message} />
      )}
      {recommendedData.status === "error" && recommendedData.message && (
        <ErrorAlert message={recommendedData.message} />
      )}
      {countsData.status === "error" && countsData.message && (
        <ErrorAlert message={countsData.message} />
      )}
      {userData.status === "error" && userData.message && <ErrorAlert message={userData.message} />}

      {phone.length > 0 ? (
        <ProfileContent navigateList={navigateList} title={`Телефон: ${getPhoneDisplay(phone)}`} />
      ) : (
        <NotContent
          title="Войдите, чтобы продолжить"
          subTitle="Заказы, избранное, лист ожидания и отзывы — всё в одном аккаунте. Введите номер телефона — на него придёт код подтверждения, и вы войдёте в систему."
          href="/sign-in"
          buttonText="Войти"
        />
      )}
      {recent.length > 0 && (
        <CarouselProducts
          headerLink={recent.length > 6 ? { text: "Смотреть все", href: "/recent" } : undefined}
          products={recent}
          title="Вы недавно смотрели"
        />
      )}
      {recommended.length > 0 && (
        <section className="carousel-list">
          <CarouselProducts products={recommended} title="Подобрали для вас" />
        </section>
      )}
    </section>
  );
}
