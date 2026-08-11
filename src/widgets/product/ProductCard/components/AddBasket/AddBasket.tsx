"use client";
import { AddSvg } from "@/shared/svg/AddSvg";
import { MinusSvg } from "@/shared/svg/MinusSvg";
import { Button } from "@/shared/ui/button-main/Button";
import { basketAdapter } from "@/stores/basket/adapter";
import { basketStore } from "@/stores/basket/store";
import styles from "./AddBasket.module.css";

type Props = {
  id: number;
  available: number | null;
  revalidateBasketAction?: () => Promise<void>;
};

export const AddBasket = (props: Props) => {
  const count = basketStore((state) => state.items[props.id]) || 0;

  const handleAddBasket = async (id: number) => {
    basketAdapter.add(id);
    if (props.revalidateBasketAction) {
      props.revalidateBasketAction();
    }
  };
  const handleDecrement = (id: number) => {
    basketAdapter.decrement(id);
    if (count <= 1 && props.revalidateBasketAction) {
      props.revalidateBasketAction();
    }
  };
  const handleIncrement = (id: number) => basketAdapter.increment(id);

  return (
    <>
      {count > 0 ? (
        <div className={styles.changeCountBasket}>
          <button
            onClick={() => handleDecrement(props.id)}
            type="submit"
            className={styles.changeCountButton}
          >
            <MinusSvg size={18} />
          </button>
          <span className={styles.count}>{count}</span>
          <button
            onClick={() => handleIncrement(props.id)}
            type="submit"
            className={styles.changeCountButton}
            disabled={typeof props.available === "number" ? count >= props.available : false}
          >
            <AddSvg size={18} />
          </button>
        </div>
      ) : (
        <Button
          onClick={() => handleAddBasket(props.id)}
          fullWidth
          size="xs2"
          variantColor="violet"
        >
          Добавить
        </Button>
      )}
    </>
  );
};
