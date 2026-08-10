import Link from "next/link";
import { BrandCatalogSvg } from "@/shared/svg/BrandCatalogSvg";
import { ProductsCategorySvg } from "@/shared/svg/ProductsCategorySvg";
import styles from "./ProductCategories.module.css";

type Props = {
  brandTitle: string;
  brandHref: string;
  categoryTitle: string;
  categoryHref: string;
};

export const ProductCategories = (props: Props) => {
  return (
    <ul className={styles.productCategories}>
      {props.brandTitle && props.brandHref && (
        <li className={styles.categoryContainer}>
          <Link className={styles.categoryItem} href={props.brandHref}>
            <div className={styles.svgContainer}>
              <BrandCatalogSvg />
            </div>
            <div className={styles.categoryInfo}>
              <span className={styles.categoryValue}>{props.brandTitle}</span>
              <span className={styles.categoryLabel}>В каталог бренда</span>
            </div>
            <div className={styles.rightSide}></div>
          </Link>
        </li>
      )}
      {props.categoryTitle && props.categoryHref && (
        <li className={styles.categoryContainer}>
          <Link className={styles.categoryItem} href={props.categoryHref}>
            <div className={styles.svgContainer}>
              <ProductsCategorySvg />
            </div>
            <div className={styles.categoryInfo}>
              <span className={styles.categoryValue}>{props.categoryTitle}</span>
              <span className={styles.categoryLabel}>Все товары категории</span>
            </div>
            <div className={styles.rightSide}></div>
          </Link>
        </li>
      )}
    </ul>
  );
};
