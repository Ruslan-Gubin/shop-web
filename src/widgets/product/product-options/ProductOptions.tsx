import styles from "./ProductOptions.module.css";

type Props = {
  options: { label: string; value: string }[];
  title: string;
  labelBackground?: string;
};

export const ProductOptions = (props: Props) => {
  return (
    <div className={styles.root}>
      <span className={styles.label}>{props.title}</span>
      <ul className={styles.optionsList}>
        {props.options.map((item) => (
          <li key={item.label} className={styles.optionsItem}>
            <div className={styles.optionsLabelContainer}>
              <span
                style={{ backgroundColor: props.labelBackground ? props.labelBackground : "white" }}
                className={styles.optionsItemLabel}
              >
                {item.label}
              </span>
              <div className={styles.dottedLine}></div>
            </div>

            <div className={styles.optionsItemValueContainer}>
              <span className={styles.optionsItemValue}>{item.value}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
