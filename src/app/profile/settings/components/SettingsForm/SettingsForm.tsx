"use client";
import { Button } from "@/shared/ui/button-main/Button";
import { Input } from "@/shared/ui/input-main/Input";
import styles from "./SettingsForm.module.css";

type Props = {
  name: string;
  email: string;
  changeUserDataAction: () => Promise<void>;
};

export const SettingsForm = (props: Props) => {
  return (
    <form action={props.changeUserDataAction} className={styles.root}>
      <h2>Личные данные</h2>

      <div className={styles.fields}>
        <Input
          name="name"
          id="name"
          label="Имя"
          defaultValue={props.name}
          variant="outlined"
          variantSize="sm"
        />
        <Input
          name="email"
          id="email"
          type="email"
          label="Почта"
          defaultValue={props.email}
          variant="outlined"
          variantSize="sm"
        />
      </div>

      <Button type="submit" variant="solid" variantColor="violet">
        Сохранить
      </Button>
    </form>
  );
};
