import { ButtonBack } from "@/shared/ui/button-back/ButtonBack";
import { ErrorAlert } from "@/shared/ui/error-alert/ErrorAlert";
import { NotContent } from "@/shared/ui/not-content/NotContent";
import { PageHeader } from "@/shared/ui/page-header/PageHeader";
import { UpdateToken } from "@/views/UpdateToken/UpdateToken";
import { fetchOrderDetailData } from "../action";
import styles from "./OrderDetail.module.css";
import { DeliveryInfo } from "./components/DeliveryInfo/DeliveryInfo";
import { OrderHeader } from "./components/OrderHeader/OrderHeader";
import { OrderProducts } from "./components/OrderProducts/OrderProducts";
import { PaidInfo } from "./components/PaidInfo/PaidInfo";
import { ShortageBlock } from "./components/ShortageBlock/ShortageBlock";

export default async function OrderDetailPage(req: { params: Promise<{ id: string }> }) {
  const params = await req.params;
  const id = Number(params.id);
  const isValidId = Number.isInteger(id) && id > 0;

  if (!isValidId) {
    return (
      <section className="page-wrapper">
        <section className={styles.page}>
          <NotContent
            title="Заказ не найден"
            subTitle="Попробуйте перезагрузить страницу или вернитесь к списку заказов."
            href="/orders?all"
            buttonText="К списку заказов"
          />
        </section>
      </section>
    );
  }

  const { orderData, productsData, userData, productsOriginData, tokens } =
    await fetchOrderDetailData(id);

  const order = orderData.data;
  const user = userData.data;
  const phone = user?.phone || "";
  const products = productsData.data || [];
  const productsOrigin = productsOriginData?.data || [];

  const isOwner = !!order && !!user && order.create_user_id === user.id;
  const hasShortageStocks = products.some(
    (el) => Array.isArray(el.shortage_stocks) && el.shortage_stocks.length > 0,
  );
  const canSolveShortage =
    !!order &&
    hasShortageStocks &&
    ["new", "processing"].includes(order.status);

  return (
    <section className="page-wrapper">
      {tokens && <UpdateToken tokens={tokens} />}

      <section className={styles.page}>
        <ButtonBack label="Назад" />

        {phone.length === 0 ? (
          <NotContent
            title="Войдите, чтобы посмотреть заказ"
            subTitle="Детали заказа доступны после входа в аккаунт."
            href="/sign-in"
            buttonText="Войти"
          />
        ) : !order || !isOwner ? (
          <NotContent
            title="Заказ не найден"
            subTitle="Попробуйте перезагрузить страницу или вернитесь к списку заказов."
            href="/orders?all"
            buttonText="К списку заказов"
          />
        ) : (
          <>
            <PageHeader title={order.order_number ? `Заказ № ${order.order_number}` : "Заказ"} />

            {productsData.status === "error" && productsData.message && (
              <ErrorAlert message={productsData.message} />
            )}

            {productsOriginData?.status === "error" && productsOriginData.message && (
              <ErrorAlert message={productsOriginData.message} />
            )}

            <div className={styles.content}>
              {canSolveShortage && <ShortageBlock orderId={order.id} products={products} />}

              <OrderHeader order={order} />

              <DeliveryInfo order={order} />

              <OrderProducts
                products={products}
                productsOrigin={productsOrigin}
                orderStatus={order.status}
              />

              <PaidInfo order={order} />
            </div>
          </>
        )}
      </section>
    </section>
  );
}
