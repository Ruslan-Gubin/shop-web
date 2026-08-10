import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/button-main/Button";
import { Modal } from "@/shared/ui/modal/Modal";
import { ModalBody } from "@/shared/ui/modal/modal-body/ModalBody";
import { ModalContent } from "@/shared/ui/modal/modal-content/ModalContent";
import { ModalFooter } from "@/shared/ui/modal/modal-footer/ModalFooter";
import { ModalHeader } from "@/shared/ui/modal/modal-header/ModalHeader";
import { basketAdapter } from "@/stores/basket/adapter";
import styles from "./StockWarningModal.module.css";

type Props = {
  basket: Record<string, number>;
  active: boolean;
  onClose: () => void;
  items: { product_id: number; available: number; name: string }[];
  onSubmit: () => void;
  disabled: boolean;
  type: "checkout" | "basket";
};

export const StockWarningModal = (props: Props) => {
  const router = useRouter();

  const handleSubmit = () => {
    props.onClose();
    props.onSubmit();
  };

  const handleRouter = () => {
    props.onClose();
    router.push("/basket");
  };

  const handleChangeQuantity = (product_id: number, quantity: number) => {
    basketAdapter.setQuantity(product_id, quantity);
  };

  const handleDeleteItem = (product_id: number) => {
    basketAdapter.delete(product_id);
  };

  const getHasWarning = () => {
    let result = false;

    for (let i = 0; i < props.items.length; i++) {
      const item = props.items[i];
      const need = props.basket[item.product_id];
      if (
        (typeof need === "number" && item.available !== need) ||
        (item.available === 0 && need > 0)
      ) {
        result = true;
        break;
      }
    }

    return result;
  };

  const hasWarning = getHasWarning();

  return (
    <Modal active={props.active} handleCloseAction={props.onClose}>
      <ModalContent>
        <ModalHeader title="Недостаточно товара на складе" onClose={props.onClose} />

        <ModalBody className={styles.body}>
          <p className={styles.description}>
            Для некоторых товаров не хватает остатков на складе. Выберите действие для каждого:
          </p>

          <ul className={styles.itemList}>
            {props.items.map((item) => (
              <li key={item.product_id} className={styles.itemCard}>
                <div className={styles.itemHeader}>
                  <span className={styles.itemTitle}>{item.name}</span>

                  {typeof props.basket[item.product_id] === "number" &&
                    item.available !== props.basket[item.product_id] && (
                      <span className={styles.stockInfo}>
                        Необходимо: {props.basket[item.product_id]} шт.{" - "}
                        {item.available > 0 ? `Доступно: ${item.available} шт.` : "Нет в наличии"}
                      </span>
                    )}

                  {item.available === props.basket[item.product_id] && (
                    <span className={`${styles.stockInfo} ${styles.stockInfoSuccess}`}>
                      {`Изменено количество на ${props.basket[item.product_id]} шт.`}
                    </span>
                  )}

                  {!props.basket[item.product_id] && (
                    <span
                      className={`${styles.stockInfo} ${styles.stockInfoSuccess}`}
                    >{`Товар удален из корзины`}</span>
                  )}
                </div>

                {props.basket[item.product_id] > 0 &&
                  props.basket[item.product_id] !== item.available && (
                    <div className={styles.actions}>
                      {item.available > 0 && (
                        <Button
                          className={styles.buttonLink}
                          onClick={() => handleChangeQuantity(item.product_id, item.available)}
                          size="xs"
                          variantColor="violet"
                          variant="ghost"
                        >
                          Взять {item.available || 5} шт.
                        </Button>
                      )}

                      {
                        <Button
                          className={styles.buttonLinkDelete}
                          onClick={() => handleDeleteItem(item.product_id)}
                          size="xs"
                          variantColor="error"
                          variant="link"
                        >
                          Убрать товар
                        </Button>
                      }
                    </div>
                  )}
              </li>
            ))}
          </ul>
        </ModalBody>

        <ModalFooter
          cancelAction={{
            action: props.type === "basket" ? props.onClose : handleRouter,
            text: props.type === "basket" ? "Отмена" : "Вернуться в корзину",
          }}
          submitAction={{
            action: handleSubmit,
            disabled: props.disabled || hasWarning,
            text: "Продолжить",
            variant: "solid",
            variantColor: "violet",
            size: "sm",
          }}
        />
      </ModalContent>
    </Modal>
  );
};
