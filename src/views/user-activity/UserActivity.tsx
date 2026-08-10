"use client";
import Link from "next/link";
import { useState } from "react";
import type {
  CreateReviewPayload,
  EditReviewPayload,
  QuestionModel,
  ReviewModel,
} from "@/app/catalog/detail/[id]/action";
import type { ResponseData } from "@/shared/types/response";
import { Button } from "@/shared/ui/button-main/Button";
import { ActivityQuestions } from "./activity/questions/ActivityQuestions";
import { ActivityReviews } from "./activity/reviews/ActivityReviews";
import styles from "./UserActivity.module.css";

type Props = {
  questionData: { questions: QuestionModel[]; totalCount: number; paginationPage: number } | null;
  reviewsData: { reviews: ReviewModel[]; totalCount: number; paginationPage: number } | null;
  reviewsOptions: { rating: number; count: number } | null;
  myReview: ReviewModel | null;
  canReview: boolean;
  product_id: string;
  createQuestionAction: (
    question: string,
    product_id: string,
  ) => Promise<ResponseData<QuestionModel>>;
  createReviewAction: (payload: CreateReviewPayload) => Promise<{
    status: string;
    errors: Record<string, string>;
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

export const UserActivity = (props: Props) => {
  const [select, setSelect] = useState<"review" | "question">("review");

  return (
    <section className={styles.root}>
      <ul className={styles.headerSelect}>
        <button
          type="button"
          onClick={() => setSelect("review")}
          className={
            select === "review"
              ? `${styles.selectItem} ${styles.selectItemActive}`
              : styles.selectItem
          }
        >
          <h3>Оценки</h3>
          {props.reviewsData && props.reviewsData.totalCount > 0 && (
            <span className={styles.selectCount}>{props.reviewsData.totalCount}</span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setSelect("question")}
          className={
            select === "question"
              ? `${styles.selectItem} ${styles.selectItemActive}`
              : styles.selectItem
          }
        >
          <h3>Вопросы</h3>
          {props.questionData && props.questionData.totalCount > 0 && (
            <span className={styles.selectCount}>{props.questionData.totalCount}</span>
          )}
        </button>
      </ul>

      {select === "review" &&
        props.reviewsData &&
        (props.reviewsData?.totalCount > 0 || props.canReview) && (
          <ActivityReviews
            deleteReviewAction={props.deleteReviewAction}
            myReview={props.myReview}
            canReview={props.canReview}
            totalRating={props.reviewsOptions?.rating || 0}
            reviews={props.reviewsData?.reviews || []}
            product_id={props.product_id}
            totalCount={props.reviewsData?.totalCount || 0}
            createReviewAction={props.createReviewAction}
            editReviewAction={props.editReviewAction}
          />
        )}

      {select === "review" && props.reviewsData && props.reviewsData?.totalCount === 0 && (
        <div>Пока товар не оценили</div>
      )}

      {select === "question" && (
        <ActivityQuestions
          product_id={props.product_id}
          createQuestionAction={props.createQuestionAction}
          questions={props.questionData?.questions || []}
          totalCount={props.questionData?.totalCount || 0}
        />
      )}

      {select === "review" && props.reviewsData && props.reviewsData.totalCount > 0 && (
        <Link href={`/reviews/${props.product_id}`}>
          <Button size="md" variant="solid" variantColor="violet">
            Смотреть все отзывы
          </Button>
        </Link>
      )}

      {select === "question" && props.questionData && props.questionData.totalCount > 0 && (
        <Link href={`/questions/${props.product_id}`}>
          <Button size="md" variant="solid" variantColor="violet">
            Смотреть все вопросы
          </Button>
        </Link>
      )}
    </section>
  );
};
