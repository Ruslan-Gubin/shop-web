import type { ProductModel } from "@/app/product/action";
import { ProductList } from "../ProductList/ProductList";
import styles from "./ProductSection.module.css";

type Props = {
  title: string;
  products: ProductModel[];
};

export const ProductSection = (props: Props) => {
  return (
    <div className={styles.recommendedBlock}>
      <h2>{props.title}</h2>
      <ProductList products={props.products} />
    </div>
  );
};
