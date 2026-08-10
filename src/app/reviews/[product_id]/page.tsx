import {
  createReviewAction,
  deleteReviewAction,
  editReviewAction,
} from "@/app/catalog/detail/[id]/action";
import { getIsLoadMoreDisabled } from "@/shared/helpers/getIsLoadMoreDisabled";
import { EMPTY_IMG_SVG } from "@/shared/helpers/listenerImgError";
import { ErrorAlert } from "@/shared/ui/error-alert/ErrorAlert";
import { UpdateToken } from "@/views/UpdateToken/UpdateToken";
import { ProductInfo } from "@/widgets/product/product-info/ProductInfo";
import { fetchReviewsData } from "./action";
import { ReviewFormContainer } from "./components/form/ReviewFormContainer";
import { ReviewsList } from "./components/list/ReviewsList";

export default async function ReviewsPage(req: {
  params: Promise<{ product_id: string }>;
  searchParams: Promise<{ page: string; review_id?: string }>;
}) {
  const limit = 30;
  const params = await req.params;
  const searchParams = await req.searchParams;
  const product_id = params.product_id;
  const review_id = searchParams.review_id;
  const patch = `/reviews/${product_id}`;

  const [stocksData, pricesData, productData, canReviewData, myReviewData, reviewsData] =
    await fetchReviewsData(product_id, limit, searchParams.page);

  const product = productData.data;
  const canReview = typeof canReviewData.data === "boolean" ? canReviewData.data : false;
  const myReview = myReviewData.data;
  const reviews = reviewsData.data?.reviews || [];
  const totalCount = reviewsData.data?.totalCount || 0;
  const paginationPage = reviewsData.data?.paginationPage || 1;

  const isLoadMoreDisabled = getIsLoadMoreDisabled(String(paginationPage), totalCount, limit);

  const img = product?.photos[0]?.url || EMPTY_IMG_SVG;

  const inStock = stocksData.data
    ? stocksData.data?.available > 0 || !stocksData.data?.accounting
    : false;
  const available = stocksData.data?.accounting ? stocksData.data?.available : null;

  return (
    <section className="page-wrapper">
      {reviewsData?.tokens && <UpdateToken tokens={reviewsData.tokens} />}
      {stocksData.status === "error" && stocksData.message && (
        <ErrorAlert message={stocksData.message} />
      )}
      {pricesData.status === "error" && pricesData.message && (
        <ErrorAlert message={pricesData.message} />
      )}
      {canReviewData.status === "error" && canReviewData.message && (
        <ErrorAlert message={canReviewData.message} />
      )}
      {myReviewData.status === "error" && myReviewData.message && (
        <ErrorAlert message={myReviewData.message} />
      )}
      {productData.status === "error" && productData.message && (
        <ErrorAlert message={productData.message} />
      )}
      {reviewsData.status === "error" && reviewsData.message && (
        <ErrorAlert message={reviewsData.message} />
      )}

      {product && pricesData && stocksData && (
        <ProductInfo
          inStock={inStock}
          available={available}
          img={img}
          product_name={product.name || ""}
          product_id={Number(product_id)}
          prices={pricesData.data || []}
          description={product?.description}
        />
      )}
      <ReviewFormContainer
        totalRating={product?.rating || 0}
        createReviewAction={createReviewAction}
        editReviewAction={editReviewAction}
        deleteReviewAction={deleteReviewAction}
        totalCount={totalCount}
        product_id={product_id}
        myReview={myReview}
        canReview={canReview}
      />
      <ReviewsList
        review_id={review_id || ""}
        reviews={reviews}
        searchParams={searchParams}
        isLoadMoreDisabled={isLoadMoreDisabled}
        limit={limit}
        patch={patch}
        total={totalCount}
        isHomePage
        showFullWidth
      />
    </section>
  );
}
