"use client";
import { useEffect, useState } from "react";
import styles from "./ProductDescription.module.css";

type Props = {
  description: string;
  title: string;
  maxDescriptionLength: number;
};

export const ProductDescription = (props: Props) => {
  const [isOpenDescription, setIsOpenDescription] = useState<boolean>(false);

  useEffect(() => {
    setIsOpenDescription(false);
  }, []);

  return (
    <div className={styles.root}>
      <span className={styles.label}>Описание</span>
      <div className={styles.descriptionContainer}>
        <p className={isOpenDescription ? styles.descriptionOpen : styles.description}>
          {props.description}
        </p>
        {props.description.length >= props.maxDescriptionLength && (
          <button
            className={styles.showMoreButton}
            onClick={() => setIsOpenDescription((prev) => !prev)}
            type="button"
          >
            {!isOpenDescription ? "Показать полное описание" : "Свернуть"}
          </button>
        )}
      </div>
    </div>
  );
};
