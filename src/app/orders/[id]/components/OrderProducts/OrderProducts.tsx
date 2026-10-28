import type { ProductModel } from "@/app/action";
import { NotContent } from "@/shared/ui/not-content/NotContent";
import type { OrderProductModel, OrderStatus } from "../../../types";
import { CardTitle } from "../../../components/CardTitle/CardTitle";
import { OrderProductCard } from "../OrderProductCard/OrderProductCard";
import styles from "./OrderProducts.module.css";

type Props = {
  products: OrderProductModel[];
  productsOrigin: ProductModel[];
  orderStatus: OrderStatus;
};

export const OrderProducts = (props: Props) => {
  return (
    <section className={styles.root}>
      <CardTitle title="Состав заказа" count={props.products.length} />

      {props.products.length === 0 || props.productsOrigin.length === 0 ? (
        <NotContent
          title="Не удалось получить список товаров"
          subTitle="Попробуйте перезагрузить страницу."
          href="/catalog"
          buttonText="Перейти в каталог"
        />
      ) : (
        <ul className={styles.list}>
          {props.products.map((product) => (
            <li key={product.id}>
              <OrderProductCard
                product_id={product.product_id}
                name={product.name}
                price={product.price}
                quantity={product.quantity}
                description={product.description}
                order_status={props.orderStatus}
                photos={
                  props.productsOrigin.find((el) => el.id === product.product_id)?.photos || []
                }
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
