import {
  createReviewAction,
  deleteReviewAction,
  editReviewAction,
} from "@/app/catalog/detail/[id]/action";
import { EMPTY_IMG_SVG } from "@/shared/helpers/listenerImgError";
import { NotContent } from "@/shared/ui/not-content/NotContent";
import { PageHeader } from "@/shared/ui/page-header/PageHeader";
import { ErrorList } from "@/views/error-list/ErrorList";
import { RatingInfo } from "@/views/rating/rating-info/RatingInfo";
import { ReviewForm } from "@/views/review/form/ReviewForm";
import { UpdateToken } from "@/views/UpdateToken/UpdateToken";
import { ProductInfo } from "@/widgets/product/product-info/ProductInfo";
import { fetchUserProductReviewData } from "../../action";
import styles from "./Page.module.css";

export default async function UserProductReviewPage(req: { params: Promise<{ id: string }> }) {
  const { id } = await req.params;

  const [productData, pricesData, stocksData, myReviewData, userData] =
    await fetchUserProductReviewData(id);

  const product = productData.data;
  const prices = pricesData.data || [];
  const stocks = stocksData.data;
  const myReview = myReviewData.data;
  const phone = userData.data?.phone || "";

  const img = product?.photos[0]?.url || EMPTY_IMG_SVG;
  const inStock = stocks ? stocks.available > 0 || !stocks.accounting : false;
  const available = stocks?.accounting ? stocks.available : null;

  return (
    <section className="page-wrapper">
      {userData?.tokens && <UpdateToken tokens={userData.tokens} />}
      <ErrorList errorsList={[productData, pricesData, stocksData, myReviewData, userData]} />

      {phone.length === 0 ? (
        <NotContent
          title="Войдите, чтобы посмотреть свой отзыв"
          subTitle="Отзывы доступны после входа в аккаунт."
          href="/sign-in"
          buttonText="Войти"
        />
      ) : (
        <>
          {product && stocks && (
            <ProductInfo
              inStock={inStock}
              available={available}
              img={img}
              product_name={product.name || ""}
              product_id={Number(id)}
              prices={prices}
              description={product.description}
            />
          )}

          <PageHeader title="Мой отзыв" />

          {product && (
            <section className={styles.formCard}>
              {product.rating > 0 && product.review_count > 0 && (
                <RatingInfo
                  totalRating={product.rating}
                  totalCount={product.review_count}
                  product_id={id}
                />
              )}
              <ReviewForm
                product_id={id}
                myReview={myReview}
                createReviewAction={createReviewAction}
                editReviewAction={editReviewAction}
                deleteReviewAction={deleteReviewAction}
                initActive
                isNotClose
              />
            </section>
          )}
        </>
      )}
    </section>
  );
}
