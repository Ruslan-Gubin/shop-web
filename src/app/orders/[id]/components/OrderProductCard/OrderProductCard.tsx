"use client";
import Link from "next/link";
import type { PhotoModel } from "@/app/action";
import { formatterRub } from "@/shared/helpers/formatters";
import { basketAdapter } from "@/stores/basket/adapter";
import { basketStore } from "@/stores/basket/store";
import { ProductCardImage } from "@/widgets/product/ProductCard/components/ProductCardImage/ProductCardImage";
import type { OrderStatus } from "../../../types";
import styles from "./OrderProductCard.module.css";

type Props = {
  name: string;
  price: number;
  quantity: number;
  description: string;
  photos: PhotoModel[];
  product_id: number;
  order_status: OrderStatus;
};

export const OrderProductCard = (props: Props) => {
  const isInBasket = basketStore(
    (store) => typeof store.items[String(props.product_id)] === "number",
  );

  const handleAddToBasket = () => {
    basketAdapter.add(props.product_id);
  };

  return (
    <article className={styles.root}>
      <Link
        href={`/catalog/detail/${props.product_id}`}
        className={styles.imageLink}
        aria-label={props.name || "Перейти к товару"}
      >
        <ProductCardImage photos={props.photos} />
      </Link>

      <div className={styles.productInfo}>
        {props.price > 0 && (
          <span>Цена: {formatterRub.format(props.price)}</span>
        )}
        {props.quantity > 0 && (
          <span>Количество: {props.quantity} шт.</span>
        )}
        {props.name.length > 0 && <span className={styles.productName}>{props.name}</span>}
        {props.description.length > 0 && (
          <p className={styles.productDescription}>{props.description}</p>
        )}

        <div className={styles.actions}>
          {!isInBasket && (
            <button type="button" className={styles.action} onClick={handleAddToBasket}>
              Добавить в корзину
            </button>
          )}

          {props.order_status === "completed" && (
            <Link href={`/reviews/${props.product_id}`} className={styles.action}>
              Оценить
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};
