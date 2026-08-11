"use client";
import { useEffect, useState } from "react";
import { AddSvg } from "@/shared/svg/AddSvg";
import { MinusSvg } from "@/shared/svg/MinusSvg";
import { basketAdapter } from "@/stores/basket/adapter";
import { basketStore } from "@/stores/basket/store";
import styles from "./BasketProductCount.module.css";

type Props = {
  id: number;
  available: number;
  accounting: boolean;
};

export const BasketProductCount = (props: Props) => {
  const count = basketStore((store) => store.items[props.id]);
  const [quantity, setQuantity] = useState<string>("");

  useEffect(() => {
    if (count && typeof count === "number" && !Number.isNaN(count)) {
      setQuantity(String(count));
    }
  }, [count]);

  const handleIncrementProduct = (id: number) => basketAdapter.increment(id);
  const handleDecrementProduct = (id: number) => basketAdapter.decrement(id);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const position = e.target.selectionStart || 0;

    let updateQuantity = "";

    if (!/^\d*$/.test(value)) {
      return;
    }

    if (position === 1) {
      if (value === "") {
        updateQuantity = value;
      } else if (value.length > 2) {
        updateQuantity = `${value.at(0)}${value.at(2)}`;
      } else {
        updateQuantity = value;
      }
    } else if (position === 2) {
      if (value.length > 2) {
        updateQuantity = value.slice(1);
      } else if (value.length === 3) {
        updateQuantity = value;
      } else {
        updateQuantity = value;
      }
    } else if (position === 3) {
      if (value === "") {
        updateQuantity = value.slice(0, -1);
      } else {
        updateQuantity = value.slice(1);
      }
    } else {
      updateQuantity = value;
    }

    setQuantity(updateQuantity);
  };

  const changeCountInputBlur = (value: string) => {
    const quantity = Number(value);

    if (typeof quantity === "number" && !Number.isNaN(quantity)) {
      let updateQuantity = quantity || 1;

      if (props.accounting && updateQuantity > props.available) {
        updateQuantity = props.available;
      }

      basketAdapter.setQuantity(props.id, updateQuantity);

      setQuantity(String(updateQuantity));
    }
  };

  return (
    <div className={styles.productActions}>
      <button
        type="button"
        onClick={() => handleDecrementProduct(props.id)}
        className={styles.productActionButton}
        disabled={count <= 1}
      >
        <MinusSvg />
      </button>
      <input
        min={1}
        name="quantity"
        autoComplete="off"
        type="text"
        inputMode="numeric"
        className={styles.productActionInput}
        value={quantity}
        onChange={handleInputChange}
        onBlur={(e) => changeCountInputBlur(e.target.value)}
      />
      <button
        type="button"
        onClick={() => handleIncrementProduct(props.id)}
        className={styles.productActionButton}
        disabled={props.accounting && count >= props.available}
      >
        <AddSvg />
      </button>
    </div>
  );
};
