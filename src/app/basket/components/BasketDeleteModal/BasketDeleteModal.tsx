"use client";
import { basketAdapter } from "@/stores/basket/adapter";
import { modalsAdapter } from "@/stores/modals/adapter";
import { modalsStore } from "@/stores/modals/store";
import { ModalDelete } from "@/widgets/modals/modal-delete/ModalDelete";

type Props = {
  revalidateBasketAction: () => Promise<void>;
};

export const BasketDeleteModal = (props: Props) => {
  const deleteItems = modalsStore((store) => store.deleteItems);

  const closeModal = () => modalsAdapter.clearDeleteItems();

  const handleDeleteItemsInBasket = () => {
    for (let i = 0; i < deleteItems.length; i++) {
      basketAdapter.delete(deleteItems[i]);
    }
    closeModal();
    props.revalidateBasketAction();
  };

  return (
    <ModalDelete
      disabled={false}
      isOpen={deleteItems.length > 0}
      onClose={closeModal}
      submit={handleDeleteItemsInBasket}
      title={deleteItems.length > 1 ? "Удалить выбранные товары" : "Удалить товар"}
    />
  );
};
