"use client";
import { HeartBasketSvg } from "@/shared/svg/HeartBasketSvg";
import { favoritesAdapter } from "@/stores/favorites/adapter";
import { favoritesStore } from "@/stores/favorites/store";
import styles from "./BasketProductFavorites.module.css";

type Props = {
  id: number;
};

export const BasketProductFavorites = (props: Props) => {
  const activeFavorites = favoritesStore((store) => store.items[props.id]) || 0;

  const handleToggleFavorites = (id: number) => favoritesAdapter.toggle(id);

  return (
    <button
      type="button"
      className={
        activeFavorites
          ? `${styles.actionButtonSvg} ${styles.actionButtonSvgFavorites}`
          : styles.actionButtonSvg
      }
      onClick={() => handleToggleFavorites(props.id)}
    >
      <HeartBasketSvg size={20} />
    </button>
  );
};
