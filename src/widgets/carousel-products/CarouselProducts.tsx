"use client";
import Link from "next/link";
import type { ProductModel } from "@/app/action";
import { useHorizontalScroll } from "@/shared/hooks/useHorizontalScroll";
import { ArrowRightSvg } from "@/shared/svg/ArrowRightSvg";
import { Button } from "@/shared/ui/button-main/Button";
import { RatingBadge } from "@/shared/ui/rating-badge/RatingBadge";
import { AddBasket } from "../product/ProductCard/components/AddBasket/AddBasket";
import { ProductCardImage } from "../product/ProductCard/components/ProductCardImage/ProductCardImage";
import { ProductFavorites } from "../product/ProductCard/components/ProductFavorites/ProductFavorites";
import { QuickViewButton } from "../product/ProductCard/components/QuickViewButton/QuickViewButton";
import { ProductPrice } from "../product/product-price/ProductPrice";
import styles from "./CarouselProducts.module.css";

type Props = {
  products: ProductModel[];
  title: string;
  headerLink?: {
    href: string;
    text: string;
  };
};

export const CarouselProducts = (props: Props) => {
  const { ref, activeArrows, leftActive, rightActive, handleScroll } = useHorizontalScroll();

  const getInStock = (available: number, accounting: boolean) =>
    (accounting && typeof available === "number" && available > 0) || !accounting;

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.headerTitleContainer}>
          <h2>{props.title}</h2>
          {props.headerLink && (
            <Link href={props.headerLink.href} className={styles.headerLink}>
              {props.headerLink.text}
            </Link>
          )}
        </div>
      </header>
      <div className={styles.carouselWrapper}>
        <ul ref={ref} className={styles.carouselList}>
          {props.products.map((product) => (
            <li key={product.id} className={styles.productItem}>
              <div className={styles.productItemImgContainer}>
                <div className={styles.heardButtonContainer}>
                  <ProductFavorites id={product.id} />
                </div>
                <Link href={`/catalog/detail/${product.id}`}>
                  <ProductCardImage photos={product.photos} />
                </Link>
                <div className={styles.fastView}>
                  <div className={styles.fastViewButtonContainer}>
                    <QuickViewButton product_id={product.id} />
                  </div>
                </div>
              </div>
              <Link href={`/catalog/detail/${product.id}`}>
                <div className={styles.productItemInfo}>
                  <p className={styles.productItemInfoName}>{product.name}</p>
                  <ProductPrice size="sm" product_id={product.id} priceList={product.price_list} />
                  <RatingBadge rating={product.rating} reviewCount={product.review_count} />
                </div>
              </Link>
              {getInStock(product.available, product.accounting) ? (
                <AddBasket available={product.available} id={product.id} />
              ) : (
                <Button fullWidth size="xs2" variantColor="light-gray" disabled>
                  Нет в наличии
                </Button>
              )}
            </li>
          ))}
        </ul>
        {activeArrows && (
          <>
            <button
              type="button"
              disabled={!leftActive}
              onClick={() => handleScroll("left")}
              className={styles.buttonPrev}
            >
              <ArrowRightSvg title="Назад" />
            </button>
            <button
              type="button"
              disabled={!rightActive}
              onClick={() => handleScroll("right")}
              className={styles.buttonNext}
            >
              <ArrowRightSvg title="Дальше" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
