"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import type { ProductModel } from "@/app/action";
import type { SearchModel } from "@/app/catalog/action";
import { HeaderNewStyle } from "../HeaderNewStyle/HeaderNewStyle";
import { ProductCardNewStyle } from "../ProductCardNewStyle/ProductCardNewStyle";
import styles from "./PreviewShell.module.css";

type Gradient = "solid" | "rainbow";

type Props = {
  popular: string[];
  products: ProductModel[];
  fetchSuggestionsAction: (
    searchValue: string,
  ) => Promise<SearchModel[] | null>;
};

const gradientList: { id: Gradient; label: string }[] = [
  { id: "solid", label: "Без" },
  { id: "rainbow", label: "Радуга" },
];

const isGradient = (value: string | null): value is Gradient =>
  gradientList.some((item) => item.id === value);

export const PreviewShell = (props: Props) => {
  const searchParams = useSearchParams();
  const gradientParam = searchParams.get("gradient");
  const gradient: Gradient = isGradient(gradientParam)
    ? gradientParam
    : "solid";

  const handleGradientChange = (id: Gradient) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("theme");
    params.set("gradient", id);
    window.history.replaceState(null, "", `?${params.toString()}`);
  };

  return (
    <div
      className={`${styles.shell} ${styles[gradient]}`}
      data-new-style-preview
    >
      <div className={styles.toolbar} role="group" aria-label="Градиент шапки">
        <p className={styles.toolbarTitle}>Графит · главная</p>
        <div className={styles.gradientList}>
          {gradientList.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={gradient === item.id}
              onClick={() => handleGradientChange(item.id)}
              className={`${styles.gradientButton} ${gradient === item.id ? styles.gradientButtonActive : ""}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.headerSlot}>
        <Suspense fallback={<div className={styles.headerFallback} />}>
          <HeaderNewStyle
            popular={props.popular}
            fetchSuggestionsAction={props.fetchSuggestionsAction}
          />
        </Suspense>
      </div>
      <ul className={styles.productGrid}>
        {props.products.map((product) => (
          <ProductCardNewStyle
            key={product.id}
            id={product.id}
            name={product.name}
            priceList={product.price_list}
            available={product.available}
            accounting={product.accounting}
            rating={product.rating}
            reviewCount={product.review_count}
            photos={product.photos}
          />
        ))}
      </ul>
    </div>
  );
};
