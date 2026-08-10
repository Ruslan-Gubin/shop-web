"use client";
import { useMemo } from "react";
import { formatterRub } from "@/shared/helpers/formatters";
import { getCurrentPrice } from "@/shared/helpers/getCurrentPrice";
import { CartPriceSvg } from "@/shared/svg/CartPriceSvg";
import { basketStore } from "@/stores/basket/store";
import styles from "./ProductPrice.module.css";

type Props = {
  product_id: number;
  priceList: { price: number; minQuantity: number }[];
  size: "sm" | "lg";
  stickyAction?: boolean;
};

export const ProductPrice = (props: Props) => {
  const count = basketStore((state) => state.items[props.product_id]) || 0;

  const currentPrice = useMemo(
    () => getCurrentPrice(count || 1, props.priceList),
    [props.priceList, count],
  );

  return (
    <div
      className={
        props.stickyAction
          ? `${styles.priceLine} ${styles.priceLineStickyAction}`
          : styles.priceLine
      }
    >
      {currentPrice > 0 && (
        <>
          <div
            className={
              props.size === "sm"
                ? `${styles.svgContainer} ${styles.svgContainerSm}`
                : styles.svgContainer
            }
          >
            <CartPriceSvg size={props.size === "sm" ? 16 : 24} />
          </div>
          <h2 className={props.size === "sm" ? `${styles.price} ${styles.priceSm}` : styles.price}>
            {formatterRub.format(currentPrice)}
          </h2>
        </>
      )}
    </div>
  );
};
