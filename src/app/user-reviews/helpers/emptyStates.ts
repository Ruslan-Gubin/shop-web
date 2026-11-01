import type { UserReviewsViewFlag } from "../types";

export const emptyStates: Record<
  UserReviewsViewFlag,
  { title: string; subTitle: string; href: string; buttonText: string }
> = {
  waiting: {
    title: "Нет товаров, ожидающих отзыва",
    subTitle: "Купленные товары, которые вы ещё не оценили, появятся здесь.",
    href: "/orders?purchases",
    buttonText: "Перейти к покупкам",
  },
  reviews: {
    title: "Вы пока не оставляли отзывов",
    subTitle: "Ваши отзывы на купленные товары появятся здесь.",
    href: "/catalog",
    buttonText: "Перейти в каталог",
  },
  questions: {
    title: "Вы пока не задавали вопросов",
    subTitle: "Ваши вопросы о товарах появятся здесь.",
    href: "/catalog",
    buttonText: "Перейти в каталог",
  },
};
