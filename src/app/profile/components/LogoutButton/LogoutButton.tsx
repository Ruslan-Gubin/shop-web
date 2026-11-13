"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { logoutAction } from "@/app/action";
import { Button } from "@/shared/ui/button-main/Button";
import { Modal } from "@/shared/ui/modal/Modal";
import { ModalBody } from "@/shared/ui/modal/modal-body/ModalBody";
import { ModalContent } from "@/shared/ui/modal/modal-content/ModalContent";
import { ModalFooter } from "@/shared/ui/modal/modal-footer/ModalFooter";
import { ModalHeader } from "@/shared/ui/modal/modal-header/ModalHeader";
import { notificationAdapter } from "@/stores/notification/adapter";

type Props = {
  className?: string;
  fullWidth?: boolean;
};

export const LogoutButton = ({ className, fullWidth }: Props) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    if (!isPending) setIsOpen(false);
  };

  const handleLogout = () => {
    startTransition(() => {
      logoutAction().then((response) => {
        if (response.status === "success") {
          setIsOpen(false);
          router.push("/");
          router.refresh();
          return;
        }
        notificationAdapter.add(response.message || "Не удалось выйти из аккаунта", "error");
      });
    });
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        variantColor="error"
        onClick={handleOpen}
        disabled={isPending}
        customClass={className}
        fullWidth={fullWidth}
      >
        <p>Выйти из аккаунта</p>
      </Button>

      <Modal active={isOpen} handleCloseAction={handleClose}>
        <ModalContent>
          <ModalHeader title="Выход из аккаунта" onClose={handleClose} />
          <ModalBody>
            <p>Вы действительно хотите выйти?</p>
          </ModalBody>
          <ModalFooter
            cancelAction={{ action: handleClose, text: "Отмена", disabled: isPending }}
            submitAction={{
              action: handleLogout,
              text: "Выйти",
              disabled: isPending,
              variantColor: "error",
            }}
          />
        </ModalContent>
      </Modal>
    </>
  );
};
