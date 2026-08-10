import { filterAdapter } from "@/stores/filter/adapter";
import { filterStore } from "@/stores/filter/store";
import styles from "./FilterNormalSize.module.css";

export const FilterNormalSize = () => {
  const sizeCard = filterStore((store) => store.sizeCard);

  const handleChangeSize = () => filterAdapter.setSizeCard("normal");

  return (
    <button
      type="button"
      onClick={handleChangeSize}
      className={`${styles.button} ${sizeCard === "normal" ? styles.buttonActive : ""}`}
    >
      <div className={styles.buttonElement}></div>
      <div className={styles.buttonElement}></div>
      <div className={styles.buttonElement}></div>
      <div className={styles.buttonElement}></div>
      <div className={styles.buttonElement}></div>
      <div className={styles.buttonElement}></div>
      <div className={styles.buttonElement}></div>
      <div className={styles.buttonElement}></div>
      <div className={styles.buttonElement}></div>
      <div className={styles.screen}></div>
    </button>
  );
};
