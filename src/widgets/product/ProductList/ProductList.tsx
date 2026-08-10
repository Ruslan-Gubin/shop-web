import type { ProductModel } from "@/app/product/action";
import { ProductCard } from "../ProductCard/ProductCard";
import styles from "./ProductList.module.css";

type Props = {
  products: ProductModel[];
  variant?: "" | "md" | "lg" | "catalog";
};

export const ProductList = (props: Props) => {
  return (
    <ul className={`${styles.productList} ${props.variant ? styles[props.variant] : ""}`}>
      {props.products.map((product) => (
        <ProductCard
          photos={product.photos}
          key={product.id}
          id={product.id}
          name={product.name}
          priceList={product.price_list}
          available={product.available}
          accounting={product.accounting}
          rating={product.rating}
          reviewCount={product.review_count}
        />
      ))}
    </ul>
  );
};
