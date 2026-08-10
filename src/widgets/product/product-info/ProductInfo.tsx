import Link from "next/link";
import { BasketProductFavorites } from "@/app/basket/components/BasketProductFavorites/BasketProductFavorites";
import { ButtonBack } from "@/shared/ui/button-back/ButtonBack";
import { ProductBasketActions } from "@/widgets/product/product-basket-actions/ProductBasketActions";
import { ProductBasketNotStock } from "@/widgets/product/product-basket-not-stock/ProductBasketNotStock";
import styles from "./ProductInfo.module.css";
import { ProductPrices } from "./ProductPrices";

type Props = {
  img: string;
  product_name: string;
  product_id: number;
  prices: { price: number; minQuantity: number }[];
  description: string;
  available: number | null;
  inStock: boolean;
};

export const ProductInfo = (props: Props) => {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <ButtonBack label="Назад" />
        {props.inStock && <BasketProductFavorites id={props.product_id} />}
      </header>

      <div className={styles.content}>
        <div className={styles.leftSide}>
          <Link href={`/catalog/detail/${props.product_id}`} className={styles.imageLink}>
            <picture className={styles.imagePicture}>
              <img src={props.img} alt="Product img" className={styles.image} />
            </picture>
          </Link>
          <div className={styles.productInfo}>
            <ProductPrices priceList={props.prices} id={props.product_id} />
            {props.product_name && (
              <Link href={`/catalog/detail/${props.product_id}`} className={styles.nameLink}>
                <span>{props.product_name}</span>
              </Link>
            )}
            {props.description && <div className={styles.description}>{props.description}</div>}
          </div>
        </div>
        <div className={styles.basketActions}>
          {props.inStock ? (
            <ProductBasketActions available={props.available} product_id={props.product_id} />
          ) : (
            <ProductBasketNotStock product_id={props.product_id} />
          )}
        </div>
      </div>
    </div>
  );
};
