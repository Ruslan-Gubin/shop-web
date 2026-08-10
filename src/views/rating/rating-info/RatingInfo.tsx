import Link from "next/link";
import { declOfNum } from "@/shared/helpers/declOfNum";
import styles from "./RatingInfo.module.css";

type Props = {
  totalRating: number;
  totalCount: number;
  product_id: string | number;
};

const STARS = [1, 2, 3, 4, 5];

export const RatingInfo = (props: Props) => {
  const progressPercent = (props.totalRating / 5) * 100;

  return (
    <div className={styles.ratingInfo}>
      <h2>{props.totalRating}</h2>
      <ul className={styles.totalRatingStars}>
        <div className={styles.starsGray}>
          {STARS.map((star) => (
            <li key={star} className={styles.totalRatingItem}>
              ★
            </li>
          ))}
        </div>
        <div className={styles.starsGold} style={{ width: `${progressPercent}%` }}>
          {STARS.map((star) => (
            <li key={star} className={styles.totalRatingItem}>
              ★
            </li>
          ))}
        </div>
      </ul>
      <Link href={`/reviews/${props.product_id}`}>
        <span className={styles.ratingInfoTotalCount}>
          {props.totalCount} {declOfNum(props.totalCount, ["оценка", "оценки", "оценок"])}
        </span>
      </Link>
    </div>
  );
};
