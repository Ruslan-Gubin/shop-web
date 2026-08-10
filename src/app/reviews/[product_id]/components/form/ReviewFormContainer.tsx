import type {
  CreateReviewPayload,
  EditReviewPayload,
  ReviewModel,
} from "@/app/catalog/detail/[id]/action";
import type { ResponseData } from "@/shared/types/response";
import { RatingInfo } from "@/views/rating/rating-info/RatingInfo";
import { ReviewForm } from "@/views/review/form/ReviewForm";
import styles from "./ReviewFormContainer.module.css";

type Props = {
  product_id: string;
  totalCount: number;
  myReview: ReviewModel | null;
  canReview: boolean;
  totalRating: number;
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

export const ReviewFormContainer = (props: Props) => {
  return (
    <div className={styles.root}>
      <div className={styles.selectItem}>
        <h3>Отзывы</h3>
        {props.totalCount > 0 && <span className={styles.selectCount}>{props.totalCount}</span>}
      </div>

      {props.totalRating > 0 && props.totalCount > 0 && (
        <RatingInfo
          totalRating={props.totalRating}
          totalCount={props.totalCount}
          product_id={props.product_id}
        />
      )}
      {props.canReview && (
        <ReviewForm
          deleteReviewAction={props.deleteReviewAction}
          myReview={props.myReview}
          editReviewAction={props.editReviewAction}
          createReviewAction={props.createReviewAction}
          product_id={props.product_id}
        />
      )}
    </div>
  );
};
