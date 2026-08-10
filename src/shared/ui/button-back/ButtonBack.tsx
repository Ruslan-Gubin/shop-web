"use client";
import { useRouter } from "next/navigation";
import { ArrowRightSvg } from "@/shared/svg/ArrowRightSvg";
import styles from "./ButtonBack.module.css";

type Props = {
  label?: string;
};

export const ButtonBack = (props: Props) => {
  const router = useRouter();
  return (
    <button onClick={router.back} type="button" className={styles.buttonBack}>
      <div className={styles.svgBack}>
        <ArrowRightSvg title="Назад" size={{ height: 16, width: 18 }} />
      </div>
      {props.label && <span>{props.label}</span>}
    </button>
  );
};
