"use client";
import { type SubmitEventHandler, useLayoutEffect, useState } from "react";
import { Button } from "@/shared/ui/button-main/Button";
import { Input } from "@/shared/ui/input-main/Input";
import { notificationAdapter } from "@/stores/notification/adapter";
import type { ChangeUserDataPayload, ChangeUserDataResponse } from "../../action";
import styles from "./SettingsForm.module.css";

type Props = {
  name: string;
  email: string;
  changeUserDataAction: (payload: ChangeUserDataPayload) => Promise<ChangeUserDataResponse>;
};

export const SettingsForm = (props: Props) => {
  const [values, setValues] = useState<ChangeUserDataPayload>({ name: "", email: "" });
  const [errors, setErrors] = useState<ChangeUserDataPayload>({ name: "", email: "" });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <one update values in props>
  useLayoutEffect(() => {
    setValues({
      name: props.name || "",
      email: props.email || "",
    });
  }, []);

  const submitForm: SubmitEventHandler = (e) => {
    e.preventDefault();
    props
      .changeUserDataAction({ name: values.name.trim(), email: values.email })
      .then((response) => {
        if (response.status === "error") {
          setErrors(response.errors);
        }
        notificationAdapter.add(response.message, response.status);
      });
  };

  const handleChangeValues = (value: string, key: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  return (
    <form onSubmit={submitForm} className={styles.root}>
      <h2>Личные данные</h2>

      <div className={styles.fields}>
        <Input
          onChange={(e) => handleChangeValues(e.target.value, "name")}
          name="name"
          id="name"
          label="Имя"
          value={values.name}
          variant="outlined"
          variantSize="sm"
          error={errors.name}
          autoComplete="off"
        />
        <Input
          onChange={(e) => handleChangeValues(e.target.value, "email")}
          name="email"
          id="email"
          label="Почта"
          value={values.email}
          variant="outlined"
          variantSize="sm"
          error={errors.email}
          autoComplete="off"
        />
      </div>

      <Button customClass={styles.submitButton} type="submit" variant="solid" variantColor="violet">
        <p>Сохранить</p>
      </Button>
    </form>
  );
};
