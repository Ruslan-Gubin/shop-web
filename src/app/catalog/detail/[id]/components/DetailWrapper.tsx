import type { PhotoModel, ProductModel } from "@/app/action";
import type { CategoryModel } from "@/app/category/action";
import type { ProductSpecificationModel } from "@/app/specifications/action";
import { ActionBasket } from "./ActionBasket/ActionBasket";
import { AddRecent } from "./AddRecent/AddRecent";
import { DetailHeader } from "./DetailHeader/DetailHeader";
import { DetailInfo } from "./DetailInfo/DetailInfo";
import styles from "./DetailWrapper.module.css";
import { Photos } from "./Photos/Photos";

type Props = {
  product: ProductModel;
  fullUrl: string;
  prices: { price: number; minQuantity: number }[];
  specifications: ProductSpecificationModel[];
  stocks: { available: number; accounting: boolean } | null;
  breadcrumbs: { label: string; href: string }[];
  categoryMain: CategoryModel | null;
  questionCount: number;
  reviewsOptions: { rating: number; count: number } | null;
  photos: PhotoModel[];
};

export const DetailWrapper = (props: Props) => {
  const inStock = props.stocks ? props.stocks.available > 0 || !props.stocks.accounting : false;
  const available = props.stocks?.accounting ? props.stocks?.available : null;

  return (
    <div className={styles.root}>
      {props.product && <AddRecent product_id={props.product.id} />}
      <DetailHeader
        inStock={inStock}
        fullUrl={props.fullUrl}
        id={props.product.id}
        breadcrumbs={props.breadcrumbs}
      />
      <section className={styles.detailsContent}>
        <Photos photos={props.photos} />
        <DetailInfo
          reviewsData={props.reviewsOptions}
          questionCount={props.questionCount}
          categoryMain={props.categoryMain}
          inStock={inStock}
          available={available}
          prices={props.prices}
          product={props.product}
          specifications={props.specifications}
        />
        <ActionBasket
          available={available}
          inStock={inStock}
          product_id={props.product.id}
          prices={props.prices}
        />
      </section>
    </div>
  );
};
