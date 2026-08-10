import styles from "./ModalBody.module.css";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export const ModalBody = (props: Props) => {
  return (
    <section className={`${styles.root} ${props.className ? props.className : ""}`}>
      {props.children}
    </section>
  );
};
