"use client";
import type { ProductModel } from "@/app/action";
import { ProductList } from "@/widgets/product/ProductList/ProductList";
import styles from "./RecentListWrapper.module.css";

type Props = {
  products: ProductModel[];
};

export const RecentListWrapper = (props: Props) => {
  return (
    <div className={styles.root}>
      {props.products.length > 0 && <ProductList variant="md" products={props.products} />}
    </div>
  );
};
