"use client";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import type { PhotoModel } from "@/app/product/action";
import { debounce } from "@/shared/helpers/debounce";
import { EMPTY_IMG_SVG, listenerImgError } from "@/shared/helpers/listenerImgError";
import { ArrowRightSvg } from "@/shared/svg/ArrowRightSvg";
import styles from "./Photos.module.css";

type Props = {
  photos: PhotoModel[];
};

export const Photos = (props: Props) => {
  const [selectPhoto, setSelectPhoto] = useState<number>(0);
  const ref = useRef<HTMLUListElement | null>(null);
  const [upActive, setUpActive] = useState<boolean>(false);
  const [downActive, setDownActive] = useState<boolean>(true);

  const handleMouseEnterVariant = (index: number) => {
    if (selectPhoto !== index) {
      setSelectPhoto(index);
    }
  };

  const scrollListener = useEffectEvent(() => {
    if (ref.current) {
      const currentScroll = ref.current.scrollTop;
      if (currentScroll <= 0) {
        if (upActive) {
          setUpActive(false);
        }
      } else {
        if (!upActive) {
          setUpActive(true);
        }

        const clientHeight = ref.current.clientHeight;
        const scrollHeight = ref.current.scrollHeight;
        const isEnd = currentScroll + clientHeight >= scrollHeight;

        if (isEnd && downActive) {
          setDownActive(false);
        }

        if (!isEnd && !downActive) {
          setDownActive(true);
        }
      }
    }
  });

  useEffect(() => {
    if (!ref.current) return;
    const scrollListenerDebounce = debounce(scrollListener, 200);
    ref.current.addEventListener("scroll", scrollListenerDebounce);

    return () => {
      if (ref.current) {
        ref.current.removeEventListener("scroll", scrollListenerDebounce);
      }
    };
  }, []);

  const handleScroll = (direction: "up" | "down") => {
    if (ref.current) {
      const clientRect = ref.current.getBoundingClientRect();
      const step = clientRect.height / 6;
      const scrollTop = ref.current.scrollTop;
      const top = direction === "up" ? scrollTop - step : scrollTop + step;

      ref.current.scrollTo({ behavior: "smooth", top });
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.wrapper}>
        <div className={styles.photosContainer}>
          <ul ref={ref} className={styles.photosList}>
            {props.photos.map((photo, index) => (
              <li
                onMouseEnter={() => handleMouseEnterVariant(index)}
                key={photo.id}
                className={
                  index === selectPhoto
                    ? `${styles.photosItem} ${styles.photosItemActive}`
                    : styles.photosItem
                }
              >
                <button type="button" className={styles.photosItemContainerButton}>
                  {photo.url ? (
                    <picture className={styles.photosItemContainer}>
                      <img
                        loading="lazy"
                        onError={listenerImgError}
                        src={photo.url}
                        alt="Select images"
                        className={styles.photoSelectImg}
                      />
                    </picture>
                  ) : (
                    <picture className={styles.photosItemContainer}>
                      <img
                        onError={listenerImgError}
                        src={EMPTY_IMG_SVG}
                        alt="Select images"
                        className={styles.photoSelectImg}
                      />
                    </picture>
                  )}
                </button>
              </li>
            ))}
          </ul>

          {props.photos.length > 6 && (
            <>
              <button
                className={`${styles.buttonScroll} ${styles.buttonScrollUp}`}
                type="button"
                onClick={() => handleScroll("up")}
                disabled={!upActive}
              >
                <ArrowRightSvg title="Вверх" size={{ height: 16, width: 18 }} />
              </button>
              <button
                className={`${styles.buttonScroll} ${styles.buttonScrollDown}`}
                type="button"
                onClick={() => handleScroll("down")}
                disabled={!downActive}
              >
                <ArrowRightSvg title="Вниз" size={{ height: 16, width: 18 }} />
              </button>
            </>
          )}
        </div>
        <div className={styles.selectPhotoContainer}>
          {props.photos[selectPhoto]?.url ? (
            <picture>
              <img
                className={styles.selectPhoto}
                src={props.photos[selectPhoto].url}
                alt="Product images"
                loading="lazy"
                onError={listenerImgError}
              />
            </picture>
          ) : (
            <picture>
              <img src={EMPTY_IMG_SVG} className={styles.selectPhoto} alt="Product images" />
            </picture>
          )}
        </div>
      </div>
    </div>
  );
};
