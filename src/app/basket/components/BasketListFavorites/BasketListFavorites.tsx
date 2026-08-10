"use client";
import { HeartBasketSvg } from "@/shared/svg/HeartBasketSvg";
import { basketStore } from "@/stores/basket/store";
import { favoritesAdapter } from "@/stores/favorites/adapter";
import { favoritesStore } from "@/stores/favorites/store";
import styles from "./BasketListFavorites.module.css";

export const BasketListFavorites = () => {
  const selected = basketStore((store) => store.selected);
  const favorites = favoritesStore((store) => store.items);

  const getIsSelectAllFavorites = () => {
    let select = selected.length > 0;

    for (let i = 0; i < selected.length; i++) {
      const id = selected[i];
      if (!Object.hasOwn(favorites, id)) {
        select = false;
      }
    }

    return select;
  };

  const isSelectAllFavorites = getIsSelectAllFavorites();

  const handleAddFavorites = () => {
    if (isSelectAllFavorites) {
      favoritesAdapter.cancelMany(selected);
    } else {
      favoritesAdapter.addMany(selected);
    }
  };

  return (
    <button
      type="button"
      disabled={selected.length === 0}
      className={
        isSelectAllFavorites
          ? `${styles.headerActionButton} ${styles.headerActionButtonFavoritesActive}`
          : styles.headerActionButton
      }
      onClick={handleAddFavorites}
    >
      <HeartBasketSvg size={16} />
    </button>
  );
};
