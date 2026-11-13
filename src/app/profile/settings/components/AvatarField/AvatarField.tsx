"use client";
import { useRef } from "react";
import { UserSvg } from "@/shared/svg/UserSvg";
import { Button } from "@/shared/ui/button-main/Button";
import styles from "./AvatarField.module.css";

type Props = {
  avatarUrl: string;
  changeUserAvatarAction: () => Promise<void>;
};

export const AvatarField = (props: Props) => {
  const fileRef = useRef<HTMLInputElement | null>(null);

  return (
    <form action={props.changeUserAvatarAction} className={styles.root}>
      <div className={styles.avatar}>
        {props.avatarUrl ? (
          <picture>
            <img className={styles.image} src={props.avatarUrl} alt="Аватар" />
          </picture>
        ) : (
          <UserSvg />
        )}
      </div>

      <div className={styles.actions}>
        <input ref={fileRef} className={styles.file} type="file" accept="image/*" />
        <Button
          type="button"
          variant="outline"
          variantColor="violet"
          size="sm"
          onClick={() => fileRef.current?.click()}
        >
          {props.avatarUrl ? "Изменить" : "Загрузить"}
        </Button>
        <Button type="submit" variant="ghost" variantColor="error" size="sm">
          Удалить
        </Button>
      </div>
    </form>
  );
};
