"use client";
import { useMemo } from "react";
import { formatterRub } from "@/shared/helpers/formatters";
import { getCurrentPrice } from "@/shared/helpers/getCurrentPrice";
import { CartSvg } from "@/shared/svg/CartSvg";
import { basketStore } from "@/stores/basket/store";
import styles from "./ProductPrices.module.css";

type Props = {
  id: number;
  isMobile?: boolean;
  priceList: { price: number; minQuantity: number }[];
};

export const ProductPrices = (props: Props) => {
  const count = basketStore((store) => store.items[props.id]) || 1;

  const currentPrice = useMemo(
    () => getCurrentPrice(count || 1, props.priceList),
    [props.priceList, count],
  );

  const largePrice = useMemo(() => {
    let price = 0;

    if (props.priceList.length > 0) {
      for (let i = 0; i < props.priceList.length; i++) {
        const currentPrice = props.priceList[i].price;

        if (!price || (typeof currentPrice === "number" && price < currentPrice)) {
          price = currentPrice;
        }
      }
    }

    return price;
  }, [props.priceList]);

  return (
    <div className={styles.productPriceContainer}>
      {currentPrice > 0 && (
        <>
          <CartSvg />
          <span className={styles.productPriceTotal}>
            {formatterRub.format(currentPrice * count)}
          </span>
        </>
      )}
      {largePrice > 0 && currentPrice > 0 && currentPrice < largePrice && (
        <span className={styles.productPriceDiscount}>
          {formatterRub.format(largePrice * count)}
        </span>
      )}
    </div>
  );
};
