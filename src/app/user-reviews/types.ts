import type { ProductModel } from "@/app/action";
import type { QuestionModel } from "@/app/catalog/detail/[id]/action";

export type UserReviewsViewFlag = "waiting" | "reviews" | "questions";

export type UserReviewsSearchParams = {
  waiting?: string;
  reviews?: string;
  questions?: string;
  page?: string;
};

export type UserReviewsListResponse = {
  products: ProductModel[];
  totalCount: number;
  paginationPage: number;
};

export type UserProductQuestionsResponse = {
  questions: QuestionModel[];
  totalCount: number;
  paginationPage: number;
};
