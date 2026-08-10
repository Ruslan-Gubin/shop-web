"use client";
import styles from "./Copyright.module.css";

export const Copyright = () => {
  const fullYear = new Date().getFullYear();

  return (
    <span className={styles.copyright}>
      © Raduga {fullYear > 2026 ? `2026-${fullYear}` : "2026"}. Все права защищены.
    </span>
  );
};
