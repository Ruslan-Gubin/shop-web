import Link from "next/link";
import type { CategoryModel } from "@/app/category/action";
import type { ProductModel } from "@/app/product/action";
import { CatalogProducts } from "../Products/Products";
import styles from "./Wrapper.module.css";

type Props = {
  categories: CategoryModel[];
  products: ProductModel[];
  isLoadMoreDisabled: boolean;
  patch: string;
  searchParams: { [key: string]: string | string[] | undefined };
  limit: number;
  total: number;
};

export const CatalogWrapper = async (props: Props) => {
  return (
    <section className={styles.root}>
      {props.categories.length > 0 && (
        <ul className={styles.categoryList}>
          <h3 className={styles.categoryTitle}>Категории</h3>
          {props.categories.map((category) => (
            <li key={category.id} className={styles.categoryItem}>
              <Link className={styles.categoryLink} href={`/catalog/?category=${category.id}`}>
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <CatalogProducts
        key={props.patch}
        limit={props.limit}
        total={props.total}
        showFullWidth={props.categories.length === 0}
        isLoadMoreDisabled={props.isLoadMoreDisabled}
        products={props.products}
        patch={props.patch}
        searchParams={props.searchParams}
      />
    </section>
  );
};
