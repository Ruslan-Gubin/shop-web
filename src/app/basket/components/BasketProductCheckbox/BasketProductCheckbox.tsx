"use client";
import { Checkbox } from "@/shared/ui/checkbox/Checkbox";
import { basketAdapter } from "@/stores/basket/adapter";
import { basketStore } from "@/stores/basket/store";

type Props = {
  id: number;
};

export const BasketProductCheckbox = (props: Props) => {
  const selected = basketStore((store) => store.selected);

  const handleSelectToggle = (id: number) => basketAdapter.selectToggle(id);

  return (
    <Checkbox checked={selected.includes(props.id)} onChange={() => handleSelectToggle(props.id)} />
  );
};
