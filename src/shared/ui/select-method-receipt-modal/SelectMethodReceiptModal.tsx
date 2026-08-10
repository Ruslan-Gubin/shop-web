import styles from "./SelectMethodReceiptModal.module.css";

type Props = {
  methodReceipt: "pickup" | "courier";
  onChangeMethod: (value: "pickup" | "courier") => void;
};

export const SelectMethodReceiptModal = (props: Props) => {
  return (
    <div className={styles.selectTypeContainer}>
      <button
        className={
          props.methodReceipt === "pickup"
            ? `${styles.selectTypeButton} ${styles.selectTypeButtonActive}`
            : styles.selectTypeButton
        }
        type="button"
        onClick={() => props.onChangeMethod("pickup")}
      >
        Самовывоз
      </button>
      <button
        type="button"
        className={
          props.methodReceipt === "courier"
            ? `${styles.selectTypeButton} ${styles.selectTypeButtonActive}`
            : styles.selectTypeButton
        }
        onClick={() => props.onChangeMethod("courier")}
      >
        Курьером
      </button>
    </div>
  );
};
