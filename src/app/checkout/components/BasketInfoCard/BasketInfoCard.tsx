import styles from "./BasketInfoCard.module.css";

type Props = {
  children: React.ReactNode;
  title: string;
};

export const BasketInfoCard = (props: Props) => {
  return (
    <section className={styles.root}>
      <h2 className={styles.headerTitle}>{props.title}</h2>
      {props.children}
    </section>
  );
};
