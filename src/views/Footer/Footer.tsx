import Link from "next/link";
import { Copyright } from "./components/Copyright";
import styles from "./Footer.module.css";

export const Footer = () => {
  const links = [
    { label: "О нас", href: "/services/about" },
    { label: "Контакты", href: "/services/contacts" },
    { label: "Оплата", href: "/services/payment" },
    { label: "Возврат товаров", href: "/services/return" },
    { label: "Частые вопросы", href: "/services/faq" },
    { label: "Реквизиты", href: "/services/requisites" },
  ];

  return (
    <footer className={styles.footer}>
      <ul className={styles.linkList}>
        {links.map((link) => (
          <li key={link.label} className={styles.linkItem}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
      <Copyright />
    </footer>
  );
};
