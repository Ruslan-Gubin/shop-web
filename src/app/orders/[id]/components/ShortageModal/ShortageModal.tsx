"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ErrorAlert } from "@/shared/ui/error-alert/ErrorAlert";
import { Modal } from "@/shared/ui/modal/Modal";
import { ModalBody } from "@/shared/ui/modal/modal-body/ModalBody";
import { ModalContent } from "@/shared/ui/modal/modal-content/ModalContent";
import { ModalFooter } from "@/shared/ui/modal/modal-footer/ModalFooter";
import { ModalHeader } from "@/shared/ui/modal/modal-header/ModalHeader";
import { acceptShortageAction, rejectOrderAction } from "../../../action";
import { getLeftQuantity } from "../../../helpers/shortage";
import type { OrderProductModel } from "../../../types";
import styles from "./ShortageModal.module.css";

type Props = {
  orderId: number;
  products: OrderProductModel[];
  notProductLeft: boolean;
  active: boolean;
  onClose: () => void;
};

export const ShortageModal = (props: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSuccess = () => {
    props.onClose();
    router.push("/orders?all");
    router.refresh();
  };

  const handleCancelOrder = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await rejectOrderAction(
        props.orderId,
        "Отменён из-за нехватки товара на складе",
      );

      if (response.status === "success") {
        handleSuccess();
      } else {
        setError(response.message || "Не удалось отменить заказ");
      }
    } catch {
      setError("Не удалось отменить заказ");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await acceptShortageAction(props.orderId);

      if (response.status === "success") {
        handleSuccess();
      } else {
        setError(response.message || "Не удалось применить изменения");
      }
    } catch {
      setError("Не удалось применить изменения");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal active={props.active} handleCloseAction={props.onClose}>
      <ModalContent>
        <ModalHeader title="Недостаточно товара на складе" onClose={props.onClose} />

        <ModalBody className={styles.body}>
          <p className={styles.description}>
            {props.notProductLeft
              ? "Все товары из заказа закончились на складе. Вы можете отменить заказ."
              : "Для некоторых товаров не хватает остатков на складе. Примените изменения или отмените заказ."}
          </p>

          <ul className={styles.list}>
            {props.products.map((product) => {
              const left = getLeftQuantity(
                product.quantity,
                product.reservations,
                product.shortage_stocks,
              );

              return (
                <li key={product.id} className={styles.itemCard}>
                  {product.name.length > 0 && <span className={styles.itemName}>{product.name}</span>}
                  <span className={left === 0 ? `${styles.stockInfo} ${styles.stockInfoDanger}` : styles.stockInfo}>
                    {`Необходимо: ${product.quantity} шт. - ${
                      left > 0 ? `Доступно: ${left} шт.` : "Нет в наличии"
                    }`}
                  </span>
                </li>
              );
            })}
          </ul>

          {error.length > 0 && <ErrorAlert message={error} />}
        </ModalBody>

        <ModalFooter
          cancelAction={{
            action: handleCancelOrder,
            text: "Отменить заказ",
            variant: "outline",
            variantColor: "error",
            disabled: loading,
          }}
          submitAction={
            props.notProductLeft
              ? undefined
              : {
                  action: handleApply,
                  text: "Применить",
                  variant: "solid",
                  variantColor: "violet",
                  disabled: loading,
                }
          }
        />
      </ModalContent>
    </Modal>
  );
};
