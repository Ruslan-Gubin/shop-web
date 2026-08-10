import { ProductBasketActions } from "@/widgets/product/product-basket-actions/ProductBasketActions";
import { ProductBasketNotStock } from "@/widgets/product/product-basket-not-stock/ProductBasketNotStock";
import { ProductPrice } from "@/widgets/product/product-price/ProductPrice";
import styles from "./ActionBasket.module.css";

type Props = {
  product_id: number;
  prices: { price: number; minQuantity: number }[];
  inStock: boolean;
  available: number | null;
};

export const ActionBasket = (props: Props) => {
  return (
    <div className={styles.basketContainer}>
      {props.inStock ? (
        <>
          <ProductPrice
            stickyAction
            size="lg"
            product_id={props.product_id}
            priceList={props.prices}
          />
          <ProductBasketActions available={props.available} product_id={props.product_id} />
        </>
      ) : (
        <>
          <h2>Нет в наличии</h2>
          <ProductBasketNotStock product_id={props.product_id} />
        </>
      )}
    </div>
  );
};
