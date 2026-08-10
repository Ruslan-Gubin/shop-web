import Link from "next/link";
import styles from "./ErrorAlert.module.css";

type Props = {
  message?: string | Error;
  link?: {
    label: string;
    href: string;
  };
};

export const ErrorAlert = (props: Props) => {
  return (
    <section className={styles.container}>
      <p className={styles.icon}>⚠️</p>
      <p className={styles.message}>
        {typeof props.message === "string" && props.message.length > 0
          ? props.message
          : props.message instanceof Error &&
              props.message.message &&
              props.message.message.length > 0
            ? props.message.message
            : "Ошибка"}
      </p>
      {props.link && (
        <Link href={props.link?.href} className={styles.actionButton}>
          {props.link.label}
        </Link>
      )}
    </section>
  );
};
