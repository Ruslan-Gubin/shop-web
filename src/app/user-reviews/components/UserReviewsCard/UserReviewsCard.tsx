import Link from "next/link";
import type { ProductModel } from "@/app/action";
import {
  EMPTY_IMG_SVG,
  listenerImgError,
} from "@/shared/helpers/listenerImgError";
import { getUserReviewsProductPath } from "../../helpers/url";
import type { UserReviewsViewFlag } from "../../types";
import styles from "./UserReviewsCard.module.css";

type Props = {
  product: ProductModel;
  viewFlag: UserReviewsViewFlag;
};

export const UserReviewsCard = (props: Props) => {
  const { product } = props;
  const href = getUserReviewsProductPath(props.viewFlag, product.id);
  const image = product.photos?.[0]?.url || EMPTY_IMG_SVG;

  return (
    <Link
      href={href}
      className={styles.root}
      aria-label={product.name || "Товар"}
    >
      <picture className={styles.imageContainer}>
        <img
          src={image}
          alt={product.name || "Товар"}
          className={styles.image}
          loading="lazy"
          onError={listenerImgError}
        />
      </picture>

      <div className={styles.info}>
        {product.brand_name.length > 0 && (
          <span className={styles.brand}>{product.brand_name}</span>
        )}
        {product.name.length > 0 && (
          <span className={styles.name}>{product.name}</span>
        )}
        {product.description.length > 0 && (
          <p className={styles.description}>{product.description}</p>
        )}
      </div>
    </Link>
  );
};
