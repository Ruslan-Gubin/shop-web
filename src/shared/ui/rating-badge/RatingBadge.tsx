import { declOfNum } from "@/shared/helpers/declOfNum";
import { ReviewSvg } from "@/shared/svg/ReviewSvg";
import styles from "./RatingBadge.module.css";

type Props = {
  rating: number;
  reviewCount: number;
};

export const RatingBadge = (props: Props) => {
  return (
    <div className={styles.root}>
      {props.rating > 0 && props.reviewCount > 0 && (
        <>
          <ReviewSvg />
          <span>
            {props.rating}
            <span className={styles.count}>
              {" · "}
              {props.reviewCount} {declOfNum(props.reviewCount, ["оценка", "оценки", "оценок"])}
            </span>
          </span>
        </>
      )}
    </div>
  );
};
