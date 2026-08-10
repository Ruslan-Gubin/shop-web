"use client";
import type { CSSProperties } from "react";
import type { PhotoModel } from "@/app/product/action";
import { EMPTY_IMG_SVG, listenerImgError } from "@/shared/helpers/listenerImgError";
import styles from "./ProductCardImage.module.css";

type Props = {
  photos: PhotoModel[];
};

export const ProductCardImage = (props: Props) => {
  return (
    <div className={styles.container} style={{ "--count": props.photos.length } as CSSProperties}>
      {props.photos.length > 0 ? (
        <ul className={styles.track}>
          {props.photos.map((photo) => (
            <picture key={photo.id} className={styles.imgItemPicture}>
              <img
                key={photo.id}
                className={styles.imgItem}
                src={photo.url}
                alt="Product"
                loading="lazy"
                onError={listenerImgError}
              />
            </picture>
          ))}
        </ul>
      ) : (
        <div className={styles.container}>
          <picture className={styles.imgItemPicture}>
            <img src={EMPTY_IMG_SVG} className={styles.imgItem} alt="Product img" />
          </picture>
        </div>
      )}
    </div>
  );
};
