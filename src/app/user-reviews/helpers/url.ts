import type { UserReviewsSearchParams, UserReviewsViewFlag } from "../types";

export const USER_REVIEWS_TAB_SOURCES: Record<UserReviewsViewFlag, string> = {
  waiting: "product/can-review",
  reviews: "product/reviewed",
  questions: "product/questions",
};

export const getUserReviewsViewFlag = (
  searchParams: UserReviewsSearchParams,
): UserReviewsViewFlag =>
  Object.hasOwn(searchParams, "reviews")
    ? "reviews"
    : Object.hasOwn(searchParams, "questions")
      ? "questions"
      : "waiting";

export const getUserReviewsProductPath = (
  viewFlag: UserReviewsViewFlag,
  productId: number,
): string =>
  viewFlag === "questions"
    ? `/user-reviews/questions/${productId}`
    : `/user-reviews/review/${productId}`;
