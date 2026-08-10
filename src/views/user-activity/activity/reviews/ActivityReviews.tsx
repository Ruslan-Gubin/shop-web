import Link from "next/link";
import type {
  CreateReviewPayload,
  EditReviewPayload,
  ReviewModel,
} from "@/app/catalog/detail/[id]/action";
import { formatDateLong } from "@/shared/helpers/formatters";
import { useHorizontalScroll } from "@/shared/hooks/useHorizontalScroll";
import { ArrowRightSvg } from "@/shared/svg/ArrowRightSvg";
import type { ResponseData } from "@/shared/types/response";
import { RatingInfo } from "@/views/rating/rating-info/RatingInfo";
import { ReviewForm } from "@/views/review/form/ReviewForm";
import styles from "./ActivityReviews.module.css";

type Props = {
  myReview: ReviewModel | null;
  canReview: boolean;
  reviews: ReviewModel[];
  totalCount: number;
  totalRating: number;
  product_id: string;
  createReviewAction: (payload: CreateReviewPayload) => Promise<{
    status: string;
    errors: Record<keyof CreateReviewPayload, string>;
    data: ReviewModel | null;
    message: string;
  }>;
  editReviewAction: (
    review_id: number,
    payload: EditReviewPayload,
  ) => Promise<{
    status: string;
    errors: Record<string, string>;
    data: ReviewModel | null;
    message: string;
  }>;
  deleteReviewAction: (review_id: number) => Promise<ResponseData<null>>;
};

const STARS = [1, 2, 3, 4, 5];

export const ActivityReviews = (props: Props) => {
  const { ref, activeArrows, leftActive, rightActive, handleScroll } = useHorizontalScroll();

  return (
    <div className={styles.root}>
      {props.totalRating > 0 && props.totalCount > 0 && (
        <RatingInfo
          totalRating={props.totalRating}
          totalCount={props.totalCount}
          product_id={props.product_id}
        />
      )}

      {props.canReview && (
        <ReviewForm
          myReview={props.myReview}
          createReviewAction={props.createReviewAction}
          editReviewAction={props.editReviewAction}
          deleteReviewAction={props.deleteReviewAction}
          product_id={props.product_id}
        />
      )}
      {props.reviews.length > 0 && (
        <div className={styles.carouselWrapper}>
          <ul ref={ref} className={styles.reviewsList}>
            {props.reviews.map((review) => (
              <li key={review.id} className={styles.reviewItem}>
                <header className={styles.reviewHeader}>
                  <div className={styles.hearerLeftSide}>
                    <h4>Пользователь</h4>
                    <span className={styles.reviewDate}>
                      {review.created_at ? formatDateLong(review.created_at) : ""}
                    </span>
                  </div>
                  <ul className={styles.ratingList}>
                    {STARS.map((star) => (
                      <div
                        key={star}
                        className={`${styles.reviewStar} ${star <= review.rating ? styles.starActive : styles.reviewStarInactive}`}
                      >
                        ★
                      </div>
                    ))}
                  </ul>
                </header>
                <Link
                  href={`/reviews/${props.product_id}/?review_id=${review.id}`}
                  className={styles.contentLink}
                >
                  <div className={styles.content}>
                    {review.dignities.length > 0 && (
                      <p className={styles.reviewText}>
                        <span className={styles.reviewLabel}>Достоинства:</span>
                        {review.dignities}
                      </p>
                    )}

                    {review.disadvantages.length > 0 && (
                      <p className={styles.reviewText}>
                        <span className={styles.reviewLabel}>Недостатки:</span>
                        {review.disadvantages}
                      </p>
                    )}

                    {review.comment.length > 0 && (
                      <p className={styles.reviewText}>
                        <span className={styles.reviewLabel}>Комментарий:</span>
                        {review.comment}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          {activeArrows && (
            <>
              <button
                type="button"
                disabled={!leftActive}
                onClick={() => handleScroll("left")}
                className={styles.buttonNavigate}
              >
                <ArrowRightSvg title="Назад" size={{ height: 16, width: 18 }} />
              </button>

              <button
                type="button"
                disabled={!rightActive}
                onClick={() => handleScroll("right")}
                className={`${styles.buttonNavigate} ${styles.buttonNavigateNext}`}
              >
                <ArrowRightSvg title="Дальше" size={{ height: 16, width: 18 }} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
