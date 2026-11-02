import { declOfNum } from "@/shared/helpers/declOfNum";
import { getIsLoadMoreDisabled } from "@/shared/helpers/getIsLoadMoreDisabled";
import { NotContent } from "@/shared/ui/not-content/NotContent";
import { PageHeader } from "@/shared/ui/page-header/PageHeader";
import { ErrorList } from "@/views/error-list/ErrorList";
import { UpdateToken } from "@/views/UpdateToken/UpdateToken";
import { fetchOrdersData } from "./action";
import { OrdersList } from "./components/OrdersList/OrdersList";
import { OrdersTabs } from "./components/OrdersTabs/OrdersTabs";
import { emptyStates } from "./helpers/emptyStates";
import { getOrdersViewFlag } from "./helpers/url";
import type { OrdersSearchParams, OrdersViewFlag } from "./types";

const limit = 30;

export default async function OrdersPage(req: { searchParams: Promise<OrdersSearchParams> }) {
  const searchParams = await req.searchParams;
  const viewFlag = getOrdersViewFlag(searchParams);
  const page = searchParams.page && Number(searchParams.page) > 0 ? searchParams.page : "1";

  const viewTitles: Record<OrdersViewFlag, string> = {
    orders: "Заказы",
    purchases: "Покупки",
    waiting: "Лист ожидания",
  };

  const [ordersData, countsData, userData] = await fetchOrdersData(viewFlag, page, limit);

  const orders = ordersData.data?.orders || [];
  const total = ordersData.data?.totalCount || 0;
  const counts = countsData.data;
  const phone = userData.data?.phone || "";

  const isLoadMoreDisabled = getIsLoadMoreDisabled(page, total, limit);
  const emptyState = emptyStates[viewFlag];

  return (
    <section className="page-wrapper">
      {userData?.tokens && <UpdateToken tokens={userData.tokens} />}

      {phone.length === 0 ? (
        <NotContent
          title="Войдите, чтобы посмотреть заказы"
          subTitle="Заказы, покупки и лист ожидания доступны после входа в аккаунт."
          href="/sign-in"
          buttonText="Войти"
        />
      ) : (
        <section className="page-wrapper">
          <PageHeader
            title={viewTitles[viewFlag]}
            subtitle={
              total > 0 ? `${total} ${declOfNum(total, ["заказ", "заказа", "заказов"])}` : undefined
            }
          />

          <OrdersTabs viewFlag={viewFlag} counts={counts} />
          <ErrorList errorsList={[ordersData, countsData, userData]} />

          {orders.length > 0 ? (
            <OrdersList
              patch="/orders"
              orders={orders}
              viewFlag={viewFlag}
              limit={limit}
              total={total}
              isLoadMoreDisabled={isLoadMoreDisabled}
              searchParams={searchParams}
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
