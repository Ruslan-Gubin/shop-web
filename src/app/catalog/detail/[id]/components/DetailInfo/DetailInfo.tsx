import type { CategoryModel, ProductModel, ProductSpecificationModel } from "@/app/action";
import { getProductDimensions } from "@/shared/helpers/getProductDimensions";
import { getSpecificationsProductInfo } from "@/shared/helpers/getSpecificationsProductInfo";
import { ActivityBar } from "@/shared/ui/activity-bar/ActivityBar";
import { BrandLink } from "@/shared/ui/brand-link/BrandLink";
import { ProductBasketActions } from "@/widgets/product/product-basket-actions/ProductBasketActions";
import { ProductBasketNotStock } from "@/widgets/product/product-basket-not-stock/ProductBasketNotStock";
import { ProductCategories } from "@/widgets/product/product-categories/ProductCategories";
import { ProductDescription } from "@/widgets/product/product-description/ProductDescription";
import { ProductOptions } from "@/widgets/product/product-options/ProductOptions";
import { ProductPrice } from "@/widgets/product/product-price/ProductPrice";
import styles from "./DetailInfo.module.css";

type Props = {
  product: ProductModel;
  specifications: ProductSpecificationModel[];
  prices: { price: number; minQuantity: number }[];
  inStock: boolean;
  available: number | null;
  categoryMain: CategoryModel | null;
  questionCount: number;
  reviewsData: { rating: number; count: number } | null;
};

export const DetailInfo = (props: Props) => {
  const specifications = getSpecificationsProductInfo(props.product, props.specifications);

  const dimensions = getProductDimensions(props.product);

  const brand_name =
    props.product.brand_name && props.product.brand_name.length > 0 ? props.product.brand_name : "";

  return (
    <div className={styles.infoContainer}>
      <header className={styles.infoContainerHeader}>
        {brand_name && (
          <BrandLink href={`/brands/${props.product.brand_name}`} name={props.product.brand_name} />
        )}
        {props.product.name && <h3 className={styles.title}>{props.product.name}</h3>}

        {(props.questionCount > 0 || props.reviewsData) && (
          <ActivityBar
            product_id={props.product.id}
            questionCount={props.questionCount}
            rating={props.reviewsData?.rating || 0}
            review_count={props.reviewsData?.count || 0}
          />
        )}
        <div className={styles.basketPrice}>
          {props.inStock ? (
            <ProductPrice size="lg" product_id={props.product.id} priceList={props.prices} />
          ) : (
            <h2>Нет в наличии</h2>
          )}
        </div>
      </header>

      <div className={styles.basketActionContainer}>
        {props.inStock ? (
          <ProductBasketActions available={props.available} product_id={props.product.id} />
        ) : (
          <ProductBasketNotStock product_id={props.product.id} />
        )}
      </div>

      {props.product.description.length > 0 && (
        <ProductDescription
          title="Описание"
          description={props.product.description}
          maxDescriptionLength={250}
        />
      )}

      {specifications.length > 0 && (
        <ProductOptions options={specifications} title="Характеристики" labelBackground="#F5F7FA" />
      )}

      {dimensions.length > 0 && (
        <ProductOptions options={dimensions} title="Габариты" labelBackground="#F5F7FA" />
      )}

      <ProductCategories
        brandTitle={brand_name}
        brandHref={brand_name ? `/brands/${brand_name}` : brand_name}
        categoryTitle={props?.categoryMain?.name ? props.categoryMain.name : ""}
        categoryHref={props?.categoryMain?.id ? `/catalog?category=${props.categoryMain.id}` : ""}
      />
    </div>
  );
};
