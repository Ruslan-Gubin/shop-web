"use client";
import { useRouter } from "next/navigation";
import { ArrowRightSvg } from "@/shared/svg/ArrowRightSvg";
import styles from "./ButtonGoBack.module.css";

type Props = {
  height: number;
  width: number;
};

export const ButtonGoBack = (props: Props) => {
  const router = useRouter();
  return (
    <button type="button" onClick={router.back} className={styles.buttonBack}>
      <ArrowRightSvg title="Назад" size={{ height: props.height, width: props.width }} />
    </button>
  );
};
