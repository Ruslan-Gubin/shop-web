"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ErrorAlert } from "@/shared/ui/error-alert/ErrorAlert";
import { Modal } from "@/shared/ui/modal/Modal";
import { ModalBody } from "@/shared/ui/modal/modal-body/ModalBody";
import { ModalContent } from "@/shared/ui/modal/modal-content/ModalContent";
import { ModalFooter } from "@/shared/ui/modal/modal-footer/ModalFooter";
import { ModalHeader } from "@/shared/ui/modal/modal-header/ModalHeader";
import { TextAreaResize } from "@/shared/ui/text-area-resize/TextAreaResize";
import { rejectOrderAction } from "../../../action";
import styles from "./CancelOrderModal.module.css";

type Props = {
  id: number;
};

const PRESET_REASONS = [
  "Передумал",
  "Оформил случайно",
  "Нашёл дешевле",
  "Слишком долго ждать",
  "Хочу изменить заказ",
  "Товар больше не нужен",
];

export const CancelOrderModal = (props: Props) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const finalReason = customReason.trim() || selectedReason;
  const isDisabled = finalReason.length === 0 || loading;

  const handleClose = () => {
    if (loading) return;

    setSelectedReason("");
    setCustomReason("");
    setError("");
    setOpen(false);
  };

  const handleSelectPreset = (reason: string) => {
    setCustomReason("");
    setSelectedReason((prev) => (prev === reason ? "" : reason));
  };

  const handleChangeInput = (value: string) => {
    setCustomReason(value);

    if (selectedReason.length > 0) {
      setSelectedReason("");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await rejectOrderAction(props.id, finalReason);

      if (response.status === "success") {
        setSelectedReason("");
        setCustomReason("");
        setOpen(false);
        router.push("/orders?all");
        router.refresh();
      } else {
        setError(response.message || "Не удалось отменить заказ");
      }
    } catch {
      setError("Не удалось отменить заказ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button type="button" className={styles.cancelButton} onClick={() => setOpen(true)}>
        Отменить
      </button>

      <Modal active={open} handleCloseAction={handleClose}>
        <ModalContent>
          <ModalHeader title="Отмена заказа" onClose={handleClose} />

          <ModalBody className={styles.body}>
            <p className={styles.description}>
              Укажите причину отмены или выберите из предложенного.
            </p>

            <TextAreaResize
              name="rejected_reason"
              label="Введите свою причину"
              value={customReason}
              onChange={handleChangeInput}
              disabled={loading}
              maxHeight={255}
            />

            <ul className={styles.presetList}>
              {PRESET_REASONS.map((reason) => (
                <li key={reason}>
                  <button
                    type="button"
                    className={
                      selectedReason === reason
                        ? `${styles.presetChip} ${styles.presetChipActive}`
                        : styles.presetChip
                    }
                    onClick={() => handleSelectPreset(reason)}
                  >
                    {reason}
                  </button>
                </li>
              ))}
            </ul>

            {error.length > 0 && <ErrorAlert message={error} />}
          </ModalBody>

          <ModalFooter
            cancelAction={{ action: handleClose, text: "Отмена", variant: "ghost" }}
            submitAction={{
              action: handleSubmit,
              text: "Отменить заказ",
              variantColor: "error",
              disabled: isDisabled,
              variant: "solid",
            }}
          />
        </ModalContent>
      </Modal>
    </>
  );
};
