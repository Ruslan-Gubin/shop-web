import type { ProductModel } from "@/app/product/action";
import { EMPTY_IMG_SVG } from "@/shared/helpers/listenerImgError";
import { Button } from "@/shared/ui/button-main/Button";
import { BasketOpenQuickModalWrapper } from "../BasketOpenQuickModalWrapper/BasketOpenQuickModalWrapper";
import { BasketProductCheckbox } from "../BasketProductCheckbox/BasketProductCheckbox";
import { BasketProductCount } from "../BasketProductCount/BasketProductCount";
import { BasketProductDelete } from "../BasketProductDelete/BasketProductDelete";
import { BasketProductFavorites } from "../BasketProductFavorites/BasketProductFavorites";
import { BasketProductPrices } from "../BasketProductPrices/BasketProductPrices";
import styles from "./ProductCardBasket.module.css";

type Props = {
  product: ProductModel;
};

export const ProductCardBasket = (props: Props) => {
  const inStock =
    (props.product.accounting &&
      typeof props.product.available === "number" &&
      props.product.available > 0) ||
    !props.product.accounting;

  return (
    <li className={styles.root}>
      <figure className={styles.productInfoContainer}>
        {inStock && (
          <div className={styles.checkBoxContainer}>
            <BasketProductCheckbox id={props.product.id} />
          </div>
        )}
        <BasketOpenQuickModalWrapper product_id={props.product.id}>
          <picture className={styles.productPicture}>
            <img
              className={styles.productInfoImg}
              src={props.product?.photos[0]?.url || EMPTY_IMG_SVG}
              alt="Product img"
            />
          </picture>
        </BasketOpenQuickModalWrapper>
        <figcaption className={styles.productDescriptionContainer}>
          <BasketProductPrices
            priceList={props.product.price_list}
            id={props.product.id}
            isMobile
          />
          <BasketOpenQuickModalWrapper product_id={props.product.id}>
            <p className={styles.productName}>{props.product.name}</p>
          </BasketOpenQuickModalWrapper>
          <p className={styles.productDetails}>{"1.8, серый, серебро, серебристый"}</p>
          <section className={styles.productActionButtons}>
            <BasketProductFavorites id={props.product.id} />
            <BasketProductDelete product_id={props.product.id} />
          </section>
        </figcaption>
      </figure>
      <div className={styles.productActionCountContainer}>
        {inStock ? (
          <BasketProductCount available={props.product.available} id={props.product.id} />
        ) : (
          <Button size="xs2" variantColor="light-gray" disabled>
            Нет в наличии
          </Button>
        )}
        <section className={`${styles.productActionButtons} ${styles.productActionButtonsMobile}`}>
          <BasketProductFavorites id={props.product.id} />
          <BasketProductDelete product_id={props.product.id} />
        </section>
      </div>
      <BasketProductPrices priceList={props.product.price_list} id={props.product.id} />
    </li>
  );
};
