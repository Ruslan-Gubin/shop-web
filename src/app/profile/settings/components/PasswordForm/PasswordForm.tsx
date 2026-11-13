"use client";
import { Button } from "@/shared/ui/button-main/Button";
import { Input } from "@/shared/ui/input-main/Input";
import styles from "./PasswordForm.module.css";

type Props = {
  hasPassword: boolean;
  changeUserPasswordAction: () => Promise<void>;
};

export const PasswordForm = (props: Props) => {
  return (
    <form action={props.changeUserPasswordAction} className={styles.root}>
      <h2>Пароль для входа без SMS</h2>

      <div className={styles.fields}>
        <Input
          name="password"
          id="password"
          type="password"
          label="Пароль"
          variant="outlined"
          variantSize="sm"
        />
        <Input
          name="repeatPassword"
          id="repeatPassword"
          type="password"
          label="Повторите пароль"
          variant="outlined"
          variantSize="sm"
        />
      </div>

      <p className={styles.hint}>
        Пароль нужен только для входа без SMS. Телефон остаётся основным идентификатором.
      </p>

      <Button type="submit" variant="solid" variantColor="violet">
        {props.hasPassword ? "Изменить пароль" : "Назначить пароль"}
      </Button>
    </form>
  );
};
