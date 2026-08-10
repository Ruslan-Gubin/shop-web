"use client";
import type { ProductModel } from "@/app/action";
import { ProductList } from "@/widgets/product/ProductList/ProductList";

type Props = {
  products: ProductModel[];
};

export const RecentListWrapper = (props: Props) => {
  return (
    <div>{props.products.length > 0 && <ProductList variant="md" products={props.products} />}</div>
  );
};
