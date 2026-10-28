import styles from "./CardTitle.module.css";

type Props = {
  title: string;
  count?: number;
};

export const CardTitle = (props: Props) => {
  return (
    <div className={styles.root}>
      <h3>{props.title}</h3>
      {typeof props.count === "number" && props.count > 0 && (
        <span className={styles.count}>{props.count}</span>
      )}
    </div>
  );
};
