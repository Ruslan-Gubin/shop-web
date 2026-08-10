import { cookies, headers } from "next/headers";
import { ErrorAlert } from "@/shared/ui/error-alert/ErrorAlert";
import { UpdateToken } from "@/views/UpdateToken/UpdateToken";
import { UserActivity } from "@/views/user-activity/UserActivity";
import { CarouselProducts } from "@/widgets/carousel-products/CarouselProducts";
import { ProductSection } from "@/widgets/product/product-section/ProductSection";
import {
  createQuestionAction,
  createReviewAction,
  deleteReviewAction,
  editReviewAction,
  fetchProductDetail,
} from "./action";
import { DetailWrapper } from "./components/DetailWrapper";

export default async function DetailPage(req: { params: Promise<{ id: string }> }) {
  const params = await req.params;

  const cookieStore = await cookies();
  const recentItems = cookieStore.get("recent_items");
  const basketItems = cookieStore.get("basket_items");
  const favoritesItems = cookieStore.get("favorites_items");

  const basketIds = basketItems?.value ? Object.keys(JSON.parse(basketItems.value)).join(",") : "";
  const favoriteIds = favoritesItems?.value
    ? Object.keys(JSON.parse(favoritesItems.value)).join(",")
    : "";
  let recentIds = recentItems?.value ? recentItems.value.replace("[", "").replace("]", "") : "";
  let allRecentIds = recentIds;

  if (!allRecentIds.includes(params.id)) {
    const allRecentIdsArray = recentIds.split(",");
    allRecentIdsArray.push(params.id);
    allRecentIds = allRecentIdsArray.join(",");
  }

  if (recentIds.includes(params.id)) {
    recentIds = recentIds
      .split(",")
      .filter((el) => el !== params.id)
      .join(",");
  }

  const [
    canReviewData,
    myReviewData,
    reviewsData,
    questionData,
    recommendedData,
    recentData,
    buyTogetherData,
    similarData,
    categoriesData,
    product,
    pricesData,
    specificationsData,
    stocks,
  ] = await fetchProductDetail(params.id, recentIds, allRecentIds, favoriteIds, basketIds);

  const headersList = await headers();

  const host = headersList.get("x-forwarded-host") || headersList.get("host") || "localhost:3000";
  const protocol = headersList.get("x-forwarded-proto")?.split(",")[0] || "http";
  const baseUrl = `${protocol}://${host}`;
  const fullUrl = `${baseUrl}/catalog/detail/${params.id}`;

  const recommended = recommendedData.data || [];
  const category = categoriesData.data || [];
  const similar = similarData.data || [];
  const buyTogether = buyTogetherData.data || [];
  const recent = (recentData.status === "success" && recentData.data) || [];
  const canReview = typeof canReviewData.data === "boolean" ? canReviewData.data : false;
  const myReview = myReviewData.data;

  const breadcrumbs = [
    { label: "Главная", href: "/" },
    ...category.map((el) => ({
      label: el.name,
      href: `/catalog/?category=${el.id}`,
    })),
  ];

  const categoryMain =
    product.data?.category_id && category.length > 0
      ? category.find((el) => el.id === product.data?.category_id) || null
      : null;

  const reviewsOptions =
    reviewsData.data && reviewsData.data.totalCount > 0
      ? {
          rating: product.data?.rating || 0,
          count: reviewsData.data.totalCount,
        }
      : null;

  return (
    <section className="page-wrapper">
      {stocks?.tokens && <UpdateToken tokens={stocks.tokens} />}
      {reviewsData.status === "error" && reviewsData.message && (
        <ErrorAlert message={reviewsData.message} />
      )}
      {questionData.status === "error" && questionData.message && (
        <ErrorAlert message={questionData.message} />
      )}
      {recommendedData.status === "error" && recommendedData.message && (
        <ErrorAlert message={recommendedData.message} />
      )}
      {recentData.status === "error" && recentData.message && (
        <ErrorAlert message={recentData.message} />
      )}
      {canReviewData.status === "error" && canReviewData.message && (
        <ErrorAlert message={canReviewData.message} />
      )}
      {myReviewData.status === "error" && myReviewData.message && (
        <ErrorAlert message={myReviewData.message} />
      )}
      {categoriesData.status === "error" && categoriesData.message && (
        <ErrorAlert message={categoriesData.message} />
      )}
      {buyTogetherData.status === "error" && buyTogetherData.message && (
        <ErrorAlert message={buyTogetherData.message} />
      )}
      {similarData.status === "error" && similarData.message && (
        <ErrorAlert message={similarData.message} />
      )}
      {product.status === "error" && product.message && <ErrorAlert message={product.message} />}
      {pricesData.status === "error" && pricesData.message && (
        <ErrorAlert message={pricesData.message} />
      )}
      {specificationsData.status === "error" && specificationsData.message && (
        <ErrorAlert message={specificationsData.message} />
      )}
      {product.status === "success" && product.data && (
        <DetailWrapper
          questionCount={questionData.data?.totalCount || 0}
          reviewsOptions={reviewsOptions}
          categoryMain={categoryMain}
          breadcrumbs={breadcrumbs}
          fullUrl={fullUrl}
          product={product.data}
          prices={pricesData.data || []}
          specifications={specificationsData.data || []}
          stocks={stocks.data}
          photos={product.data && Array.isArray(product.data.photos) ? product.data.photos : []}
        />
      )}

      <div className="additional-content">
        {params.id && (
          <UserActivity
            canReview={canReview}
            myReview={myReview}
            reviewsOptions={reviewsOptions}
            createReviewAction={createReviewAction}
            editReviewAction={editReviewAction}
            deleteReviewAction={deleteReviewAction}
            createQuestionAction={createQuestionAction}
            product_id={params.id}
            questionData={questionData.data}
            reviewsData={reviewsData.data}
          />
        )}

        {similar.length > 0 && <CarouselProducts products={similar} title="Похожие товары" />}
        {buyTogether.length > 0 && (
          <CarouselProducts products={buyTogether} title="С этим товаром покупают" />
        )}

        {recommended.length > 0 && <ProductSection title="Рекомендуем" products={recommended} />}

        {recent.length > 0 && (
          <CarouselProducts
            headerLink={recent.length > 6 ? { text: "Смотреть все", href: "/recent" } : undefined}
            products={recent}
            title="Вы недавно смотрели"
          />
        )}
      </div>
    </section>
  );
}
