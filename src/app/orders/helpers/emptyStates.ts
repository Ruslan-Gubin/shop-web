import type { OrdersViewFlag } from "../types";

export const emptyStates: Record<
  OrdersViewFlag,
  { title: string; subTitle: string; href: string; buttonText: string }
> = {
  orders: {
    title: "Заказов пока нет",
    subTitle: "Перейдите в корзину, чтобы оформить заказ.",
    href: "/basket",
    buttonText: "Перейти в корзину",
  },
  purchases: {
    title: "Покупок пока нет",
    subTitle: "Полученные заказы появятся в этом списке.",
    href: "/catalog",
    buttonText: "Перейти в каталог",
  },
  waiting: {
    title: "В листе ожидания пусто",
    subTitle: "Здесь появятся заказы, готовые к выдаче или доставке.",
    href: "/catalog",
    buttonText: "Перейти в каталог",
  },
};
