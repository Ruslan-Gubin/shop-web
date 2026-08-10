import { SuccessfulOperationSvg } from "@/shared/svg/SuccessfulOperationSvg";
import { Modal } from "@/shared/ui/modal/Modal";
import { ModalBody } from "@/shared/ui/modal/modal-body/ModalBody";
import { ModalContent } from "@/shared/ui/modal/modal-content/ModalContent";
import { ModalFooter } from "@/shared/ui/modal/modal-footer/ModalFooter";
import { ModalHeader } from "@/shared/ui/modal/modal-header/ModalHeader";
import styles from "./SuccessOrderModal.module.css";

type Props = {
  active: boolean;
  number?: string;
  email?: string;
  order_id: number;
  onNavigate: (order_id?: number) => void;
};

export const SuccessOrderModal = (props: Props) => {
  return (
    <Modal active={props.active} handleCloseAction={() => props.onNavigate(props.order_id)}>
      <ModalContent>
        <ModalHeader
          svg={<SuccessfulOperationSvg />}
          title={props.number ? `Заказ № ${props.number} оформлен!` : `Заказ оформлен!`}
        />

        <ModalBody className={styles.body}>
          <p>Благодарим за заказ!</p>
          {props.email && (
            <>
              <p>Детали мы отправили на вашу почту: {props.email}</p>
              <p>Проверьте, пожалуйста, папку «Спам», если письмо задерживается.</p>
            </>
          )}
          <p>Мы свяжемся с вами в ближайшее время.</p>
        </ModalBody>

        <ModalFooter
          cancelAction={{
            action: () => props.onNavigate(),
            text: "На главную",
            variant: "link",
          }}
          submitAction={{
            action: () => props.onNavigate(props.order_id),
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
