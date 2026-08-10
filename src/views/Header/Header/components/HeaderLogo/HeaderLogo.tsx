import Link from "next/link";
import styles from "./HeaderLogo.module.css";

export const HeaderLogo = () => {
  return (
    <Link href={"/"}>
      <h1 className={styles.logoText}>Raduga</h1>
    </Link>
  );
};
