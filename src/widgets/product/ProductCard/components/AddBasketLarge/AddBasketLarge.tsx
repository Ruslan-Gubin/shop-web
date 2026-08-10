"use client";
import Link from "next/link";
import { AddSvg } from "@/shared/svg/AddSvg";
import { MinusSvg } from "@/shared/svg/MinusSvg";
import { Button } from "@/shared/ui/button-main/Button";
import { basketAdapter } from "@/stores/basket/adapter";
import styles from "./AddBasketLarge.module.css";

type Props = {
  id: number;
  href: string;
  onCloseModalAction?: () => void;
  count: number;
  available: number | null;
};

export const AddBasketLarge = (props: Props) => {
  const handleAddBasket = async (id: number) => basketAdapter.add(id);
  const handleDecrement = (id: number) => basketAdapter.decrement(id);
  const handleIncrement = (id: number) => basketAdapter.increment(id);

  return (
    <>
      {props.count > 0 ? (
        <div className={styles.countLine}>
          <div className={styles.changeCountBasket}>
            <button
              onClick={() => handleDecrement(props.id)}
              type="submit"
              className={styles.changeCountButton}
            >
              <MinusSvg size={20} />
            </button>
            <span className={styles.count}>{props.count}</span>
            <button
              onClick={() => handleIncrement(props.id)}
              type="submit"
              className={styles.changeCountButton}
              disabled={
                typeof props.available === "number" ? props.count >= props.available : false
              }
            >
              <AddSvg size={20} />
            </button>
          </div>
          <Link href={props.href}>
            <Button onClick={props.onCloseModalAction} className={styles.productItemButton}>
              В корзине
            </Button>
          </Link>
        </div>
      ) : (
        <Button onClick={() => handleAddBasket(props.id)} className={styles.productItemButton}>
          <span className={styles.addButtonTextLg}>Добавить в корзину</span>
          <span className={styles.addButtonTextSm}>Добавить</span>
        </Button>
      )}
    </>
  );
};
