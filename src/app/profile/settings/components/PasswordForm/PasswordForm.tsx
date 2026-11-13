"use client";
import { type SubmitEventHandler, useState } from "react";
import { Button } from "@/shared/ui/button-main/Button";
import { Input } from "@/shared/ui/input-main/Input";
import { notificationAdapter } from "@/stores/notification/adapter";
import type { ChangeUserPasswordPayload, ChangeUserPasswordResponse } from "../../action";
import styles from "./PasswordForm.module.css";

type Props = {
  hasPassword: boolean;
  changeUserPasswordAction: (
    payload: ChangeUserPasswordPayload,
  ) => Promise<ChangeUserPasswordResponse>;
};

export const PasswordForm = (props: Props) => {
  const [values, setValues] = useState<ChangeUserPasswordPayload>({
    password: "",
    repeatPassword: "",
  });
  const [errors, setErrors] = useState<ChangeUserPasswordPayload>({
    password: "",
    repeatPassword: "",
  });

  const submitForm: SubmitEventHandler = (e) => {
    e.preventDefault();
    props.changeUserPasswordAction(values).then((response) => {
      if (response.status === "error") {
        setErrors(response.errors);
      } else {
        setValues({ password: "", repeatPassword: "" });
        setErrors({ password: "", repeatPassword: "" });
      }
      if (response.message) {
        notificationAdapter.add(response.message, response.status);
      }
    });
  };

  const handleChangeValues = (value: string, key: keyof ChangeUserPasswordPayload) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  return (
    <form onSubmit={submitForm} className={styles.root}>
      <h2>Пароль для входа без SMS</h2>

      <div className={styles.fields}>
        <Input
          onChange={(e) => handleChangeValues(e.target.value, "password")}
          name="password"
          id="password"
          type="password"
          label="Пароль"
          value={values.password}
          variant="outlined"
          variantSize="sm"
          error={errors.password}
        />
        <Input
          onChange={(e) => handleChangeValues(e.target.value, "repeatPassword")}
          name="repeatPassword"
          id="repeatPassword"
          type="password"
          label="Повторите пароль"
          value={values.repeatPassword}
          variant="outlined"
          variantSize="sm"
          error={errors.repeatPassword}
        />
      </div>

      <p className={styles.hint}>
        Пароль нужен только для входа без SMS. Телефон остаётся основным идентификатором.
      </p>

      <Button customClass={styles.submitButton} type="submit" variant="solid" variantColor="violet">
        <p>{props.hasPassword ? "Изменить пароль" : "Назначить пароль"}</p>
      </Button>
    </form>
  );
};
