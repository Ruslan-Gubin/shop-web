"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  fetchProductPrices,
  fetchProductQuestions,
  fetchProductSpecifications,
  fetchProductStocks,
} from "@/app/action";
import { fetchProduct, type ProductModel } from "@/app/product/action";
import { getProductDimensions } from "@/shared/helpers/getProductDimensions";
import { getSpecificationsProductInfo } from "@/shared/helpers/getSpecificationsProductInfo";
import { EMPTY_IMG_SVG, listenerImgError } from "@/shared/helpers/listenerImgError";
import { ArrowRightSvg } from "@/shared/svg/ArrowRightSvg";
import { CloseSvg } from "@/shared/svg/CloseSvg";
import { ActivityBar } from "@/shared/ui/activity-bar/ActivityBar";
import { BrandLink } from "@/shared/ui/brand-link/BrandLink";
import { Modal } from "@/shared/ui/modal/Modal";
import { quickViewAdapter } from "@/stores/quick-view/adapter";
import { quickViewStore } from "@/stores/quick-view/store";
import { ProductFavorites } from "@/widgets/product/ProductCard/components/ProductFavorites/ProductFavorites";
import { ProductBasketActions } from "@/widgets/product/product-basket-actions/ProductBasketActions";
import { ProductBasketNotStock } from "@/widgets/product/product-basket-not-stock/ProductBasketNotStock";
import { ProductDescription } from "@/widgets/product/product-description/ProductDescription";
import { ProductOptions } from "@/widgets/product/product-options/ProductOptions";
import { ProductPrice } from "@/widgets/product/product-price/ProductPrice";
import styles from "./QuickViewModal.module.css";

export const QuickViewModal = () => {
  const [selectImage, setSelectImage] = useState<number>(0);
  const isOpen = quickViewStore((store) => store.isOpen);
  const product_id = quickViewStore((store) => store.product_id);
  const [product, setProduct] = useState<ProductModel | null>(null);
  const [priceList, setPriceList] = useState<{ price: number; minQuantity: number }[]>([]);
  const [specifications, setSpecifications] = useState<{ label: string; value: string }[]>([]);
  const [stocks, setStocks] = useState<{ available: number; accounting: boolean } | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(0);

  const dimensions = useMemo(() => getProductDimensions(product), [product]);

  useEffect(() => {
    if (
      isOpen &&
      typeof product_id === "number" &&
      product_id > 0 &&
      (!product || (product && product.id !== product_id))
    ) {
      fetchProduct(String(product_id)).then((response) => {
        if (response.status === "success" && response.data) {
          const product = response.data;
          setProduct(product);

          fetchProductPrices(product.id).then((response) => {
            if (response.status === "success" && response.data) {
              setPriceList(response.data);
            }

            fetchProductSpecifications(product.id).then((response) => {
              if (response.status === "success" && response.data) {
                setSpecifications(getSpecificationsProductInfo(product, response.data));
              }

              fetchProductStocks(product.id).then((response) => {
                if (response.status === "success" && response.data) {
                  setStocks(response.data);
                }

                fetchProductQuestions(product.id, "1", "1").then((response) => {
                  if (response.status === "success" && response.data) {
                    setQuestionCount(response?.data?.totalCount || 0);
                  }
                });
              });
            });
          });
        }
      });
    }
  }, [product_id, isOpen, product]);

  const handleChangePhoto = (direction: "prev" | "next") => {
    let updateSelectImageCount = direction === "prev" ? selectImage - 1 : selectImage + 1;

    if (updateSelectImageCount < 0 && product) {
      updateSelectImageCount = product?.photos?.length - 1;
    } else if (product && updateSelectImageCount > product.photos.length - 1) {
      updateSelectImageCount = 0;
    }

    setSelectImage(updateSelectImageCount);
  };

  const onCloseModal = () => {
    setSelectImage(0);
    quickViewAdapter.closeModal();
  };

  const inStock = stocks ? stocks.available > 0 || !stocks.accounting : false;
  const available = stocks?.accounting ? stocks?.available : null;

  return (
    <>
      {product && (
        <Modal
          classContainer={styles.modalContent}
          active={isOpen}
          handleCloseAction={onCloseModal}
        >
          <section className={styles.imageSide}>
            <button
              className={`${styles.arrowRightButton} ${styles.arrowLeftButton}`}
              type="button"
              onClick={() => handleChangePhoto("prev")}
            >
              <ArrowRightSvg />
            </button>
            {product.photos[selectImage]?.url ? (
              <picture className={styles.imagePicture}>
                <img
                  loading="lazy"
                  onError={listenerImgError}
                  className={styles.image}
                  src={product.photos[selectImage].url}
                  alt="Product"
                />
              </picture>
            ) : (
              <picture className={styles.imagePicture}>
                <img className={styles.image} src={EMPTY_IMG_SVG} alt="Product" />
              </picture>
            )}
            <button
              className={styles.arrowRightButton}
              type="button"
              onClick={() => handleChangePhoto("next")}
            >
              <ArrowRightSvg />
            </button>
          </section>
          <section className={styles.infoSide}>
            <header className={styles.infoHeaderLine}>
              <div className={styles.titleContainer}>
                {typeof product.brand_id === "number" && (
                  <BrandLink href={`/brands/${product.brand_id}`} name={"Бренд"} />
                )}
                <Link onClick={onCloseModal} href={`/catalog/detail/${product_id}`}>
                  <h3 className={styles.title}>{product.name}</h3>
                </Link>
                {(questionCount > 0 || (product.rating > 0 && product.review_count > 0)) && (
                  <ActivityBar
                    questionCount={questionCount}
                    product_id={product.id}
                    rating={product.rating}
                    review_count={product.review_count}
                    onClickLinkAction={onCloseModal}
                  />
                )}
                <ProductPrice size="lg" product_id={product.id} priceList={priceList} />
              </div>
              <div className={styles.infoHeaderActions}>
                {inStock && <ProductFavorites size={20} id={product_id} />}
                <button type="button" onClick={onCloseModal} className={styles.closeButtonSvg}>
                  <CloseSvg />
                </button>
              </div>
            </header>
            <div className={styles.blockInfo}>
              <div className={styles.blockInfoContent}>
                {product.description.length > 0 && isOpen && (
                  <ProductDescription
                    title="Описание"
                    description={product.description}
                    maxDescriptionLength={250}
                  />
                )}

                {specifications.length > 0 && (
                  <ProductOptions options={specifications} title="Характеристики" />
                )}
                {dimensions.length > 0 && <ProductOptions options={dimensions} title="Габариты" />}
              </div>
              <footer>
                <Link href={`/catalog/detail/${product_id}`}>
                  <button onClick={onCloseModal} className={styles.buttonMoreInfo} type="button">
                    <span className={styles.addButtonTextLg}>Больше информации о товаре</span>
                    <span className={styles.addButtonTextSm}>Больше информации</span>
                  </button>
                </Link>
              </footer>
            </div>
            {inStock ? (
              <ProductBasketActions
                available={available}
                product_id={product_id}
                onCloseModalAction={onCloseModal}
              />
            ) : (
              <>
                <h2 className={styles.notStockTitle}>Нет в наличии</h2>
                <ProductBasketNotStock product_id={product_id} />
              </>
            )}
          </section>
        </Modal>
      )}
    </>
  );
};
