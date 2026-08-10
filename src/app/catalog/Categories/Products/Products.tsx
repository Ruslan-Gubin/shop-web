"use client";
import { useRouter } from "next/navigation";
import { useEffectEvent, useLayoutEffect, useState } from "react";
import type { ProductModel } from "@/app/product/action";
import { getUpdateQueryPageString } from "@/shared/helpers/getUpdateQueryPageString";
import { LoadMoreObserver } from "@/shared/ui/load-more-observer/LoadMoreObserver";
import { filterStore } from "@/stores/filter/store";
import { ProductList } from "@/widgets/product/ProductList/ProductList";
import styles from "./Products.module.css";

type Props = {
  products: ProductModel[];
  isLoadMoreDisabled: boolean;
  patch: string;
  searchParams: { [key: string]: string | string[] | undefined };
  showFullWidth: boolean;
  isHomePage?: boolean;
  limit: number;
  total: number;
};

export const CatalogProducts = (props: Props) => {
  const sizeCard = filterStore((store) => store.sizeCard);
  const [data, setData] = useState<ProductModel[]>([]);
  const router = useRouter();
  const currentPage: number = Number(props.searchParams.page || "1");

  const getUpdateDataEvent = useEffectEvent((products: ProductModel[]) => {
    const updateData: ProductModel[] = [];

    const isValidPageData = data.length === props.limit * (currentPage - 1);

    if (!isValidPageData && currentPage > 1) {
      router.push(getUpdateQueryPageString(props.patch, props.searchParams, 1));
    } else {
      if (currentPage > 1) {
        for (let i = 0; i < data.length; i++) {
          updateData.push(data[i]);
        }
      }

      for (let i = 0; i < products.length; i++) {
        if (updateData.findIndex((el) => el.id === products[i].id) === -1) {
          updateData.push(products[i]);
        }
      }
    }

    setData(updateData);
  });

  useLayoutEffect(() => {
    getUpdateDataEvent(props.products);
  }, [props.products]);

  const isValidDataFromGetMore =
    data.length === currentPage * props.limit && data.length < props.total;

  return (
    <div className={styles.productsList}>
      <ProductList
        products={data.length > 0 ? data : props.products}
        variant={
          props.isHomePage
            ? ""
            : !props.showFullWidth
              ? "catalog"
              : sizeCard === "large"
                ? "lg"
                : "md"
        }
      />
      <LoadMoreObserver
        disabled={props.isLoadMoreDisabled || !isValidDataFromGetMore}
        patch={props.patch}
        searchParams={props.searchParams}
        isValidDataFromPage={isValidDataFromGetMore}
        currentPage={currentPage}
      />
    </div>
  );
};
