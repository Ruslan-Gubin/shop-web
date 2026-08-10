import { CloseSvg } from "@/shared/svg/CloseSvg";
import styles from "./ModalHeader.module.css";

type Props = {
  title: string;
  onClose?: () => void;
  svg?: React.ReactElement;
};

export const ModalHeader = (props: Props) => {
  return (
    <header className={styles.header}>
      <div className={styles.titleWrapper}>
        {props.svg && <div className={styles.svgContainer}>{props.svg}</div>}

        <h2 className={styles.headerTitle}>{props.title}</h2>
      </div>
      {props.onClose && (
        <button type="button" onClick={props.onClose} className={styles.closeButton}>
          <CloseSvg />
        </button>
      )}
    </header>
  );
};
