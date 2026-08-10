import { type ReactNode, useRef } from "react";
import styles from "./Input.module.css";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  placeholder?: string;
  fullWidth?: boolean;
  variant?: "outlined" | "filled" | "standard";
  variantSize?: "xs" | "sm" | "md" | "lg";
  customClass?: string;
  variantColor?: "teal" | "error" | "green" | "pink";
  value?: string;
  onClickRightIcon?: () => void;
  onClickLeftIcon?: () => void;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  label?: string;
  htmlFor?: string;
  name?: string;
  phoneCodes?: string;
}
export const Input = ({
  error,
  placeholder,
  fullWidth,
  customClass,
  variantColor,
  variantSize = "lg",
  variant = "standard",
  value,
  onClickRightIcon,
  onClickLeftIcon,
  leftIcon,
  rightIcon,
  label,
  name,
  phoneCodes,
  ...rest
}: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClickReset = () => {
    if (onClickRightIcon) {
      onClickRightIcon();
    } else {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <div className={`${styles.wrapper} ${styles[variantSize]} ${styles[variant]}`}>
      {leftIcon && (
        <button
          className={styles.leftButtonSvg}
          disabled={!onClickLeftIcon}
          type="button"
          onClick={onClickLeftIcon && onClickLeftIcon}
        >
          {leftIcon}
        </button>
      )}
      {phoneCodes && (
        <span className={`${styles.phoneCodes} ${value ? styles.phoneCodesActive : ""}`}>
          {phoneCodes}
        </span>
      )}
      <div className={styles.inputWrapper}>
        {error && (
          <label htmlFor={name} className={styles.error}>
            {error}
          </label>
        )}
        {label && !error && (
          <label htmlFor={rest.id ?? name} className={styles.label}>
            {label}
          </label>
        )}
        <input
          ref={inputRef}
          name={name}
          id={rest.id ?? name}
          value={value}
          placeholder={label ? "" : (placeholder ?? "")}
          className={`${styles.input} ${variantColor ? styles[variantColor] : styles.defaultVariantColor} ${fullWidth ? styles.fullWidth : ""}  ${customClass ?? ""}`}
          {...rest}
        />
      </div>

      {rightIcon && (
        <button className={styles.buttonClear} type="button" onClick={handleClickReset}>
          {rightIcon}
        </button>
      )}
    </div>
  );
};
