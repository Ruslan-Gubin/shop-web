import Link from "next/link";
import { ArrowRightSvg } from "@/shared/svg/ArrowRightSvg";
import styles from "./ProfileContent.module.css";

type Props = {
  navigateList: {
    label: string;
    value: string;
    href: string;
    params?: { view: string };
  }[];
  title: string;
};

export const ProfileContent = (props: Props) => {
  return (
    <ul className={styles.root}>
      <h2 className={styles.title}>{props.title}</h2>
      {props.navigateList.map((item) => (
        <Link className={styles.navigateItem} href={item.href} key={item.label}>
          <div className={styles.navigateItemLeftSide}>
            <span className={styles.navigateItemTextLabel}>{item.label}</span>
            {item.value && <span className={styles.navigateItemText}>{item.value}</span>}
          </div>

          <div className={styles.navigateItemRightSide}>
            {item.href.length > 0 && <ArrowRightSvg />}
          </div>
        </Link>
      ))}
    </ul>
  );
};
