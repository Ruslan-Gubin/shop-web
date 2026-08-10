import styles from "./PageHeader.module.css";

type Props = {
  title: string;
  subtitle?: string;
};

export const PageHeader = (props: Props) => {
  return (
    <header className={styles.header}>
      <h2 className={styles.title}>{props.title}</h2>
      {props.subtitle && <span className={styles.subtitle}>{props.subtitle}</span>}
    </header>
  );
};
