"use client";
import { quickViewAdapter } from "@/stores/quick-view/adapter";

type Props = {
  children: React.ReactElement;
  product_id: number;
};

export const BasketOpenQuickModalWrapper = (props: Props) => {
  const handleOpenQuickViewModal = (id: number) => quickViewAdapter.openModal(id);

  return (
    <button type="button" onClick={() => handleOpenQuickViewModal(props.product_id)}>
      {props.children}
    </button>
  );
};
