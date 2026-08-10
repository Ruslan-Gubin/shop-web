"use client";
import { Checkbox } from "@/shared/ui/checkbox/Checkbox";
import { basketAdapter } from "@/stores/basket/adapter";
import { basketStore } from "@/stores/basket/store";

export const BasketListCheckboxAll = () => {
  const selected = basketStore((store) => store.selected);
  const totalCount = basketStore((store) => store.totalCount);

  const isSelectAllBasket = selected.length === totalCount;

  const handleChangeAllSelect = () => {
    if (isSelectAllBasket) {
      basketAdapter.cancelAll();
    } else {
      basketAdapter.selectAll();
    }
  };

  return <Checkbox labelText="Все" checked={isSelectAllBasket} onChange={handleChangeAllSelect} />;
};
