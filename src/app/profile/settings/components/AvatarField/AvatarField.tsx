"use client";
import { type ChangeEvent, type SubmitEventHandler, useRef, useState } from "react";
import { UserSvg } from "@/shared/svg/UserSvg";
import { Button } from "@/shared/ui/button-main/Button";
import styles from "./AvatarField.module.css";

type Props = {
  avatarUrl: string;
  changeUserAvatarAction: () => Promise<void>;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ACCEPTED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

const formatBytes = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(0)} МБ`;

export const AvatarField = ({ avatarUrl, changeUserAvatarAction }: Props) => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [savedAvatarUrl, setSavedAvatarUrl] = useState<string>("");
  const [removed, setRemoved] = useState(false);
  const [error, setError] = useState("");

  const baseAvatarUrl = removed ? "" : savedAvatarUrl || avatarUrl;
  const currentAvatar = previewUrl || baseAvatarUrl;

  const validateFile = (file: File) => {
    const fileName = file.name.toLowerCase();
    const hasValidExtension = ACCEPTED_EXTENSIONS.some((ext) => fileName.endsWith(ext));
    const hasValidType = ACCEPTED_TYPES.includes(file.type);

    if (!hasValidType || !hasValidExtension) {
      return "Поддерживаются только JPG, JPEG, PNG и WEBP";
    }

    if (file.size > MAX_FILE_SIZE) {
      return `Максимальный размер файла — ${formatBytes(MAX_FILE_SIZE)}`;
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

  const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
      setSelectedFile(null);
      setError(validationError);
      resetInput();
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setError("");
    setRemoved(false);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!selectedFile || !previewUrl) {
      setError("Выберите изображение для загрузки");
      return;
    }

    // TODO: заменить мок на реальную загрузку аватара
    await changeUserAvatarAction();
    if (savedAvatarUrl.startsWith("blob:")) {
      URL.revokeObjectURL(savedAvatarUrl);
    }
    setSavedAvatarUrl(previewUrl);
    setPreviewUrl("");
    setSelectedFile(null);
    setError("");
    resetInput();
  };

  const handleRemove = async () => {
    // TODO: заменить мок на реальное удаление аватара
    await changeUserAvatarAction();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (savedAvatarUrl.startsWith("blob:")) URL.revokeObjectURL(savedAvatarUrl);
    setPreviewUrl("");
    setSelectedFile(null);
    setSavedAvatarUrl("");
    setRemoved(true);
    setError("");
    resetInput();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.root}>
      <h2 className={styles.title}>Аватар</h2>

      <div className={styles.content}>
        <div className={styles.avatarWrapper}>
          <div className={styles.avatar}>
            {currentAvatar ? (
              <picture>
                <img className={styles.image} src={currentAvatar} alt="Аватар" />
              </picture>
            ) : (
              <UserSvg />
            )}
          </div>
          {selectedFile && <span className={styles.badge}>Предпросмотр</span>}
        </div>

        <div className={styles.info}>
          <p className={styles.description}>
            Загрузите фото профиля. После выбора файла вы увидите предпросмотр перед сохранением.
          </p>

          <input
            ref={fileRef}
            className={styles.file}
            type="file"
            accept={ACCEPTED_EXTENSIONS.join(",")}
            onChange={handleChangeFile}
          />

          <div className={styles.actions}>
            <Button
              type="button"
              variant="outline"
              variantColor="violet"
              size="sm"
              onClick={handlePickFile}
            >
              {selectedFile || avatarUrl ? "Выбрать другое" : "Выбрать файл"}
            </Button>
            <Button
              type="submit"
              variant="solid"
              variantColor="violet"
              size="sm"
              disabled={!selectedFile}
            >
              Сохранить
            </Button>
            <Button
              type="button"
              variant="ghost"
              variantColor="error"
              size="sm"
              onClick={handleRemove}
              disabled={!selectedFile && !avatarUrl}
            >
              Удалить
            </Button>
          </div>

          {selectedFile && (
            <p className={styles.fileName}>
              Выбран файл: <span>{selectedFile.name}</span>
            </p>
          )}

          {error && <p className={styles.error}>{error}</p>}

          <p className={styles.hint}>
            Поддерживаемые форматы: JPG, JPEG, PNG, WEBP. Максимальный размер: 5 МБ.
          </p>
        </div>
      </div>
    </form>
  );
};
