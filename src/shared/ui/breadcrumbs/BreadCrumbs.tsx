import Link from "next/link";
import { ButtonGoBack } from "../button-go-back/ButtonGoBack";
import styles from "./BreadCrumbs.module.css";

type Props = {
  breadcrumbs: { label: string; href: string }[];
  notShowBack: boolean;
};

export const BreadCrumbs = (props: Props) => {
  return (
    <section className={styles.breadCrumbs}>
      {!props.notShowBack && <ButtonGoBack width={18} height={16} />}

      <ul className={styles.breadCrumbsList}>
        {props.breadcrumbs.map((item, index) => (
          <li key={item.label} className={styles.breadCrumbsItem}>
            {item.href ? (
              <Link className={styles.linkItem} href={item.href}>
                {item.label}
              </Link>
            ) : (
              <span>{item.label}</span>
            )}
            {index < props.breadcrumbs.length - 1 && <span>{"/"}</span>}
          </li>
        ))}
      </ul>
    </section>
  );
};
