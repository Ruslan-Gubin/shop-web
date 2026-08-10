import styles from "./Checkbox.module.css";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  labelText?: string;
  isRect?: boolean;
}

export const Checkbox = ({ labelText, isRect, ...rest }: Props) => {
  return (
    <label className={styles.checkboxLabel}>
      <input
        type="checkbox"
        className={`${styles.checkbox} ${isRect ? styles.checkboxRect : ""}`}
        {...rest}
      />
      {labelText && <p className={styles.checkboxTextLabel}>{labelText}</p>}
    </label>
  );
};
