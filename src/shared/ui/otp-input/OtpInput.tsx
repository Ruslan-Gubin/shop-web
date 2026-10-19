"use client";
import { useRef } from "react";
import styles from "./OtpInput.module.css";

type Props = {
  code: string[];
  onChangeCodeAction: (id: number, value: string) => void;
  length: number;
  disabled: boolean;
  error?: boolean;
};

export const OtpInput = (props: Props) => {
  const ref = useRef<HTMLUListElement | null>(null);

  const getIsValidCodeNumberValue = (value: string) => {
    if (!value) return false;
    const num = value.length > 0 ? Number(value[0]) : "";
    return (
      value.length === 1 && typeof num === "number" && Number.isFinite(num) && !Number.isNaN(num)
    );
  };

  const handleChangeInput = (id: number, value: string) => {
    const updateValue = props.code[id] ? value.replace(props.code[id], "") : value;
    const isValidNumber = getIsValidCodeNumberValue(updateValue);

    if (isValidNumber) {
      if (ref.current && id < props.code.length - 1) {
        ref.current.childNodes.forEach((input, index) => {
          if (id + 1 === index) {
            const nextInput = input as HTMLInputElement;
            if (nextInput && typeof nextInput.focus === "function") {
              nextInput.focus();
            }
          }
        });
      }
      props.onChangeCodeAction(id, updateValue);
    }
  };

  return (
    <ul ref={ref} className={styles.root}>
      {props.code.map((value, index) => (
        <input
          key={index}
          className={`${styles.input} ${props.code[index] ? styles.boxFilled : ""} ${props.error ? styles.boxError : ""}`}
          value={value}
          onChange={(e) => handleChangeInput(index, e.target.value)}
          type="number"
          enterKeyHint="next"
          disabled={props.disabled}
          maxLength={1}
          autoComplete="off"
          tabIndex={index + 1}
          // biome-ignore lint/a11y/noAutofocus: <noAutofocus>
          autoFocus={index === 0 && !props.code[index]}
        />
      ))}
    </ul>
  );
};
