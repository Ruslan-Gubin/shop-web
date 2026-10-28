import type { OrderModel } from "@/app/checkout/action";
import { formatterRub } from "@/shared/helpers/formatters";
import { SuccessfulOperationSvg } from "@/shared/svg/SuccessfulOperationSvg";
import { Modal } from "@/shared/ui/modal/Modal";
import { ModalBody } from "@/shared/ui/modal/modal-body/ModalBody";
import { ModalContent } from "@/shared/ui/modal/modal-content/ModalContent";
import { ModalFooter } from "@/shared/ui/modal/modal-footer/ModalFooter";
import { ModalHeader } from "@/shared/ui/modal/modal-header/ModalHeader";
import styles from "./SuccessOrderModal.module.css";

type Props = {
  active: boolean;
  onNavigate: (order_id?: number) => void;
  orderData: OrderModel | null;
  addressName: string;
};

export const SuccessOrderModal = (props: Props) => {
  const total = props.orderData?.total || 0;

  const paymentLabel =
    props.orderData?.payment_method === "card" ? "Банковской картой" : "Наличными";
  const receiptLabel = props.orderData?.method_receipt === "courier" ? "Курьер" : "Самовывоз";

  return (
    <Modal active={props.active} handleCloseAction={() => props.onNavigate(props.orderData?.id)}>
      <ModalContent>
        <ModalHeader
          svg={<SuccessfulOperationSvg />}
          title={
            props.orderData?.order_number
              ? `Заказ № ${props.orderData?.order_number} оформлен!`
              : `Заказ оформлен!`
          }
        />

        <ModalBody className={styles.body}>
          <p>Благодарим за заказ!</p>
          <p>Способ получения: {receiptLabel}</p>
          {props.addressName.length > 0 && <p>Адрес: {props.addressName}</p>}
          <p>Оплата: {paymentLabel}</p>
          {total > 0 && <p>Итого: {formatterRub.format(total)}</p>}
          <p>Мы свяжемся с вами в ближайшее время.</p>
        </ModalBody>

        <ModalFooter
          cancelAction={{
            action: () => props.onNavigate(),
            text: "На главную",
            variant: "link",
          }}
          submitAction={{
            action: () => props.onNavigate(props.orderData?.id),
            text: "Перейти к заказу",
            variant: "link",
            variantColor: "violet",
            size: "sm",
          }}
        />
      </ModalContent>
    </Modal>
  );
};
