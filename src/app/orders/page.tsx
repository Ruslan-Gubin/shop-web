import { declOfNum } from "@/shared/helpers/declOfNum";
import { getIsLoadMoreDisabled } from "@/shared/helpers/getIsLoadMoreDisabled";
import { ErrorAlert } from "@/shared/ui/error-alert/ErrorAlert";
import { NotContent } from "@/shared/ui/not-content/NotContent";
import { PageHeader } from "@/shared/ui/page-header/PageHeader";
import { UpdateToken } from "@/views/UpdateToken/UpdateToken";
import { fetchOrdersData } from "./action";
import { OrdersList } from "./components/OrdersList/OrdersList";
import { OrdersTabs } from "./components/OrdersTabs/OrdersTabs";
import { getOrdersView, getOrdersViewFlag } from "./helpers/url";
import type { OrdersCounts, OrdersViewFlag } from "./types";
import styles from "./OrdersPage.module.css";

const limit = 30;

const viewTitles: Record<OrdersViewFlag, string> = {
  all: "Заказы",
  purchases: "Покупки",
  waiting: "Лист ожидания",
};

const emptyStates: Record<
  OrdersViewFlag,
  { title: string; subTitle: string; href: string; buttonText: string }
> = {
  all: {
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

export default async function OrdersPage(req: {
  searchParams: Promise<{
    all?: string;
    purchases?: string;
    waiting?: string;
    page?: string;
  }>;
}) {
  const searchParams = await req.searchParams;
  const viewFlag = getOrdersViewFlag(searchParams);
  const view = getOrdersView(viewFlag);
  const page = searchParams.page && Number(searchParams.page) > 0 ? searchParams.page : "1";

  const [ordersData, countsData, userData] = await fetchOrdersData(view, page, limit);

  const orders = ordersData.data?.orders || [];
  const total = ordersData.data?.totalCount || 0;
  const counts: OrdersCounts | null = countsData.data;
  const phone = userData.data?.phone || "";
  const tokens = ordersData.tokens || countsData.tokens || userData.tokens;

  const isLoadMoreDisabled = getIsLoadMoreDisabled(page, total, limit);
  const emptyState = emptyStates[viewFlag];

  return (
    <section className="page-wrapper">
      {tokens && <UpdateToken tokens={tokens} />}

      {phone.length === 0 ? (
        <NotContent
          title="Войдите, чтобы посмотреть заказы"
          subTitle="Заказы, покупки и лист ожидания доступны после входа в аккаунт."
          href="/sign-in"
          buttonText="Войти"
        />
      ) : (
        <section className={styles.root}>
          <PageHeader
            title={viewTitles[viewFlag]}
            subtitle={
              total > 0 ? `${total} ${declOfNum(total, ["заказ", "заказа", "заказов"])}` : undefined
            }
          />

          <OrdersTabs viewFlag={viewFlag} counts={counts} />

          {ordersData.status === "error" && ordersData.message && (
            <ErrorAlert message={ordersData.message} />
          )}

          {orders.length > 0 ? (
            <OrdersList
              orders={orders}
              viewFlag={viewFlag}
              page={page}
              limit={limit}
              total={total}
              isLoadMoreDisabled={isLoadMoreDisabled}
            />
          ) : (
            <NotContent
              title={emptyState.title}
              subTitle={emptyState.subTitle}
              href={emptyState.href}
              buttonText={emptyState.buttonText}
            />
          )}
        </section>
      )}
    </section>
  );
}
