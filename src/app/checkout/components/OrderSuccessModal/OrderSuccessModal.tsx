"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { OrderModel } from "@/app/checkout/action";
import { formatterRub } from "@/shared/helpers/formatters";
import { Button } from "@/shared/ui/button-main/Button";
import { Modal } from "@/shared/ui/modal/Modal";
import { ModalContent } from "@/shared/ui/modal/modal-content/ModalContent";
import styles from "./OrderSuccessModal.module.css";

type Props = {
  active: boolean;
  onClose: () => void;
  orderData: OrderModel | null;
  addressName?: string;
  total: number;
};

const playSuccessSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = "sine";
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime);
    oscillator.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2);
    oscillator.frequency.setValueAtTime(1046.5, audioCtx.currentTime + 0.3);

    gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.6);
  } catch {
    // Аудио не поддерживается
  }
};

export const OrderSuccessModal = (props: Props) => {
  const router = useRouter();
  const hasPlayed = useRef(false);

  useEffect(() => {
    if (props.active && !hasPlayed.current) {
      hasPlayed.current = true;
      playSuccessSound();
    }

    if (!props.active) {
      hasPlayed.current = false;
    }
  }, [props.active]);

  const orderNumber = props.orderData?.order_number ?? `#${props.orderData?.id ?? "—"}`;
  const paymentLabel =
    props.orderData?.payment_method === "card" ? "Банковской картой" : "Наличными";
  const receiptLabel =
    props.orderData?.method_receipt === "courier" ? "Курьер" : "Самовывоз";

  const handleGoToOrder = () => {
    if (props.orderData?.id) {
      router.push(`/order/${props.orderData.id}`);
    }
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <Modal active={props.active} handleCloseAction={props.onClose}>
      <ModalContent>
        <div className={styles.root}>
          <div className={styles.iconWrapper}>
            <svg
              className={styles.checkmark}
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className={styles.circle}
                cx="40"
                cy="40"
                r="36"
                stroke="#22c55e"
                strokeWidth="4"
                fill="none"
              />
              <path
                className={styles.path}
                d="M25 42l10 10 20-24"
                stroke="#22c55e"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>

          <h2 className={styles.title}>Заказ успешно оформлен!</h2>

          <p className={styles.orderNumber}>
            Номер заказа: <strong>{orderNumber}</strong>
          </p>

          <div className={styles.summary}>
            <div className={styles.row}>
              <span className={styles.label}>Способ получения</span>
              <span className={styles.value}>{receiptLabel}</span>
            </div>
            {props.addressName && (
              <div className={styles.row}>
                <span className={styles.label}>Адрес</span>
                <span className={styles.value}>{props.addressName}</span>
              </div>
            )}
            <div className={styles.row}>
              <span className={styles.label}>Оплата</span>
              <span className={styles.value}>{paymentLabel}</span>
            </div>
            <div className={`${styles.row} ${styles.totalRow}`}>
              <span className={styles.label}>Итого</span>
              <span className={styles.value}>{formatterRub.format(props.total)}</span>
            </div>
          </div>

          <div className={styles.actions}>
            <Button variantColor="violet" variant="outline" size="lg" fullWidth onClick={handleGoHome}>
              На главную
            </Button>
            <Button variantColor="violet" variant="solid" size="lg" fullWidth onClick={handleGoToOrder}>
              Перейти к заказу
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};
