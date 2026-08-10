"use client";
import { Button } from "@/shared/ui/button-main/Button";
import { favoritesAdapter } from "@/stores/favorites/adapter";
import { favoritesStore } from "@/stores/favorites/store";
import styles from "./ProductBasketNotStock.module.css";

type Props = {
  product_id: number;
};

export const ProductBasketNotStock = (props: Props) => {
  const active = favoritesStore((state) => state.items[props.product_id]) || 0;

  const handleToggleFavorite = (id: number) => favoritesAdapter.toggle(id);

  return (
    <Button
      variantColor="violet"
      variant="solid"
      size="lg"
      onClick={() => handleToggleFavorite(props.product_id)}
      disabled={typeof active === "number" && active > 0}
      fullWidth
      customClass={styles.favoritesButton}
    >
      {active ? "Добавлено в избранное" : "В избранное"}
    </Button>
  );
};
