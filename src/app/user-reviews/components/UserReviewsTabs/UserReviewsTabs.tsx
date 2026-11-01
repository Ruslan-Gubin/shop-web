import Link from "next/link";
import type { UserReviewsViewFlag } from "../../types";
import styles from "./UserReviewsTabs.module.css";

type Props = {
  viewFlag: UserReviewsViewFlag;
};

const tabs: { flag: UserReviewsViewFlag; label: string }[] = [
  { flag: "waiting", label: "Ждут отзыва" },
  { flag: "reviews", label: "Отзывы" },
  { flag: "questions", label: "Вопросы" },
];

export const UserReviewsTabs = (props: Props) => {
  return (
    <nav className={styles.root} aria-label="Виды отзывов и вопросов">
      <ul className={styles.list}>
        {tabs.map((tab) => {
          const isActive = props.viewFlag === tab.flag;

          return (
            <li key={tab.flag}>
              <Link
                href={`/user-reviews?${tab.flag}`}
                className={
                  isActive ? `${styles.tab} ${styles.tabActive}` : styles.tab
                }
                aria-current={isActive ? "page" : undefined}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
