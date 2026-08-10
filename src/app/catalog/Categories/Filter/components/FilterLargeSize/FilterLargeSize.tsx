import { filterAdapter } from "@/stores/filter/adapter";
import { filterStore } from "@/stores/filter/store";
import styles from "./FilterLargeSize.module.css";

export const FilterLargeSize = () => {
  const sizeCard = filterStore((store) => store.sizeCard);

  const handleChangeSize = () => filterAdapter.setSizeCard("large");

  return (
    <button
      type="button"
      onClick={handleChangeSize}
      className={`${styles.button} ${sizeCard === "large" ? styles.buttonActive : ""}`}
    >
      <div className={styles.buttonElement}></div>
      <div className={styles.buttonElement}></div>
      <div className={styles.buttonElement}></div>
      <div className={styles.buttonElement}></div>
    </button>
  );
};
