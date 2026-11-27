import Link from "next/link";
import type { PhotoModel } from "@/app/action";
import { Button } from "@/shared/ui/button-main/Button";
import { RatingBadge } from "@/shared/ui/rating-badge/RatingBadge";
import { ProductPrice } from "@/widgets/product/product-price/ProductPrice";
import { AddBasket } from "@/widgets/product/ProductCard/components/AddBasket/AddBasket";
import { ProductCardImage } from "@/widgets/product/ProductCard/components/ProductCardImage/ProductCardImage";
import { ProductFavorites } from "@/widgets/product/ProductCard/components/ProductFavorites/ProductFavorites";
import { QuickViewButton } from "@/widgets/product/ProductCard/components/QuickViewButton/QuickViewButton";
import styles from "./ProductCardNewStyle.module.css";

type Props = {
  name: string;
  priceList: { price: number; minQuantity: number }[];
  id: number;
  available: number | null;
  accounting: boolean;
  rating: number;
  reviewCount: number;
  photos: PhotoModel[];
};

export const ProductCardNewStyle = (props: Props) => {
  const inStock =
    (props.accounting &&
      typeof props.available === "number" &&
      props.available > 0) ||
    !props.accounting;

  return (
    <li className={styles.productItem}>
      <div className={styles.productItemImgContainer}>
        <Link href={`/catalog/detail/${props.id}`}>
          <ProductCardImage photos={props.photos} />
        </Link>
        <div className={styles.heardButtonContainer}>
          <div className={styles.favoritesSlot}>
            <ProductFavorites id={props.id} />
          </div>
        </div>
        <div className={styles.fastView}>
          <div className={styles.fastViewButtonSlot}>
            <QuickViewButton product_id={props.id} />
          </div>
        </div>
      </div>
      <Link href={`/catalog/detail/${props.id}`}>
        <div className={styles.productItemInfo}>
          <p className={styles.productItemInfoName}>{props.name}</p>
          <ProductPrice
            size="sm"
            product_id={props.id}
            priceList={props.priceList}
          />
          <RatingBadge rating={props.rating} reviewCount={props.reviewCount} />
        </div>
      </Link>
      <div className={styles.basketSlot}>
        {inStock ? (
          <AddBasket
            available={
              props.accounting &&
              typeof props.available === "number" &&
              props.available > 0
                ? props.available
                : null
            }
            id={props.id}
          />
        ) : (
          <Button fullWidth size="xs2" variantColor="light-gray" disabled>
            Нет в наличии
          </Button>
        )}
      </div>
    </li>
  );
};
