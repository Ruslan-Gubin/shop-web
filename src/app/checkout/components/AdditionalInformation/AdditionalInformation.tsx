"use client";
import { Input } from "@/shared/ui/input-main/Input";
import { TextAreaResize } from "@/shared/ui/text-area-resize/TextAreaResize";
import { checkoutAdapter } from "@/stores/checkout/adapter";
import { checkoutStore } from "@/stores/checkout/store";
import { BasketInfoCard } from "../BasketInfoCard/BasketInfoCard";
import styles from "./AdditionalInformation.module.css";

export const AdditionalInformation = () => {
  const comment = checkoutStore((store) => store.comment);
  const recipient_name = checkoutStore((store) => store.recipient_name);
  const phone = checkoutStore((store) => store.phone);
  const comment_error = checkoutStore((store) => store.comment_error);
  const recipient_name_error = checkoutStore((store) => store.recipient_name_error);
  const phone_error = checkoutStore((store) => store.phone_error);

  const handleChangeValues = (value: string, key: "recipient_name" | "phone" | "comment") => {
    checkoutAdapter.changeAdditionalInfoInputs(value, key);
  };

  const handleChangePhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    let updatePhone = value;

    if (digits.length > 3) {
      updatePhone = `${digits.slice(0, 3)} ${digits.slice(3)}`;
    }

    if (digits.length > 6) {
      updatePhone = `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    }

    if (digits.length > 8) {
      updatePhone = `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`;
    }

    checkoutAdapter.changeAdditionalInfoInputs(updatePhone, "phone");
  };

  return (
    <BasketInfoCard title="Дополнительная информация">
      <div className={styles.root}>
        <div className={styles.inputLine}>
          <div>
            <Input
              error={recipient_name_error}
              onChange={(e) => handleChangeValues(e.target.value, "recipient_name")}
              placeholder="Имя получателя"
              variantSize="md"
              variant="outlined"
              autoComplete="off"
              maxLength={50}
              inputMode="tel"
              value={recipient_name}
              name="recipient_name"
            />
          </div>
          <div>
            <Input
              error={phone_error}
              phoneCodes="+7"
              onChange={(e) => handleChangePhone(e.target.value)}
              placeholder="Телефон получателя"
              variantSize="md"
              variant="outlined"
              autoComplete="off"
              inputMode="tel"
              value={phone}
              name="phone"
              maxLength={13}
            />
          </div>
        </div>

        <div>
          <TextAreaResize
            error={comment_error}
            name="comment"
            onChange={(value) => handleChangeValues(value, "comment")}
            value={comment}
            label="Комментарий"
          />
        </div>
      </div>
    </BasketInfoCard>
  );
};
