"use client";
import { HeartSvg } from "@/shared/svg/Heart/HeartSvg";
import { favoritesAdapter } from "@/stores/favorites/adapter";
import { favoritesStore } from "@/stores/favorites/store";

type Props = {
  id: number;
  size?: number;
};

export const ProductFavorites = (props: Props) => {
  const active = favoritesStore((state) => state.items[props.id]) || 0;

  const handleToggleFavorite = (id: number) => favoritesAdapter.toggle(id);

  return (
    <button
      onClick={() => handleToggleFavorite(props.id)}
      type="button"
      aria-label="Добавить в избранное"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <HeartSvg
        size={props.size ? props.size : 24}
        active={typeof active === "number" && active > 0}
      />
    </button>
  );
};
