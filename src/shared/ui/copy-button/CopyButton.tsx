"use client";
import { CopyLinkSvg } from "@/shared/svg/CopyLinkSvg";
import { notificationAdapter } from "@/stores/notification/adapter";
import styles from "./CopyButton.module.css";

type Props = {
  copyValue: string;
  successText: string;
  errorText: string;
};

export const CopyButton = (props: Props) => {
  const handleCopyPath = () => {
    navigator.clipboard
      .writeText(props.copyValue)
      .then(() => {
        notificationAdapter.add(props.successText, "success");
      })
      .catch(() => {
        notificationAdapter.add(props.errorText, "error");
      });
  };

  return (
    <button type="button" onClick={handleCopyPath} className={styles.copyButton}>
      <CopyLinkSvg />
    </button>
  );
};
