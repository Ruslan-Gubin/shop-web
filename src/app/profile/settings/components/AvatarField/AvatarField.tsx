"use client";
import { type ChangeEvent, useRef, useState } from "react";
import type { PhotoModel } from "@/app/action";
import { CONFIG_APP } from "@/shared/config/config";
import { DeleteSvg } from "@/shared/svg/DeleteSvg";
import { UserSvg } from "@/shared/svg/UserSvg";
import type { ResponseData } from "@/shared/types/response";
import { notificationAdapter } from "@/stores/notification/adapter";
import { ModalDelete } from "@/widgets/modals/modal-delete/ModalDelete";
import styles from "./AvatarField.module.css";

type Props = {
  photoUrl?: string | null;
  backendUrl?: string;
  uploadAvatarAction: (formData: FormData) => Promise<ResponseData<PhotoModel>>;
  deleteAvatarAction: () => Promise<ResponseData<null>>;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ACCEPTED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

export const AvatarField = ({
  photoUrl,
  backendUrl = "",
  uploadAvatarAction,
  deleteAvatarAction,
}: Props) => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const baseUrl = (backendUrl || CONFIG_APP.BACKEND_URL).replace(/\/$/, "");
  const avatarSrc = photoUrl
    ? photoUrl.startsWith("http")
      ? photoUrl
      : `${baseUrl}${photoUrl.startsWith("/") ? photoUrl : `/${photoUrl}`}`
    : null;

  const validateFile = (file: File) => {
    const fileName = file.name.toLowerCase();
    const hasValidExtension = ACCEPTED_EXTENSIONS.some((ext) => fileName.endsWith(ext));
    const hasValidType = ACCEPTED_TYPES.includes(file.type);

    if (!hasValidType || !hasValidExtension) {
      return "Поддерживаются только JPG, JPEG, PNG и WEBP";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "Максимальный размер файла — 5 МБ";
    }

    return "";
  };

  const resetInput = () => {
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const handlePickFile = () => {
    fileRef.current?.click();
  };

  const handleChangeFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      resetInput();
      return;
    }

    setError("");
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    uploadAvatarAction(formData)
      .then((response) => {
        notificationAdapter.add(response.message, response.status);
      })
      .finally(() => {
        setIsLoading(false);
        resetInput();
      });
  };

  const handleDeleteAvatar = () => {
    setIsLoading(true);
    setError("");

    deleteAvatarAction()
      .then((response) => {
        notificationAdapter.add(response.message, response.status);
        if (response.status === "success") {
          setIsDeleteModalOpen(false);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <section className={styles.root}>
      <h2 className={styles.title}>Аватар</h2>

      <div className={styles.content}>
        <div className={styles.avatarWrapper}>
          <button
            type="button"
            className={styles.avatarButton}
            onClick={handlePickFile}
            aria-label={photoUrl ? "Изменить аватар" : "Загрузить аватар"}
            disabled={isLoading}
          >
            {avatarSrc ? (
              <picture>
                <img className={styles.image} src={avatarSrc} alt="Аватар пользователя" />
              </picture>
            ) : (
              <span className={styles.placeholder} aria-hidden="true">
                <UserSvg />
              </span>
            )}
          </button>

          {photoUrl && (
            <button
              type="button"
              className={styles.deleteButton}
              onClick={() => setIsDeleteModalOpen(true)}
              aria-label="Удалить аватар"
              disabled={isLoading}
            >
              <DeleteSvg fill="currentColor" />
            </button>
          )}
        </div>

        <input
          ref={fileRef}
          className={styles.file}
          type="file"
          accept={ACCEPTED_EXTENSIONS.join(",")}
          onChange={handleChangeFile}
        />

        {error && <p className={styles.error}>{error}</p>}
        <p className={styles.hint}>
          Поддерживаемые форматы: JPG, JPEG, PNG, WEBP. Максимальный размер: 5 МБ.
        </p>
      </div>

      <ModalDelete
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        submit={handleDeleteAvatar}
        disabled={isLoading}
        title="Удалить аватар"
        showSubTitle={true}
        readText="Аватар будет удалён из профиля."
      />
    </section>
  );
};
