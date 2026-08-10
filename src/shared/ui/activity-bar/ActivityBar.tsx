"use client";
import Link from "next/link";
import { declOfNum } from "@/shared/helpers/declOfNum";
import { QuestionSvg } from "@/shared/svg/QuestionSvg";
import { ReviewSvg } from "@/shared/svg/ReviewSvg";
import styles from "./ActivityBar.module.css";

type Props = {
  product_id: number | string;
  rating: number;
  review_count: number;
  questionCount: number;
  onClickLinkAction?: () => void;
};

export const ActivityBar = (props: Props) => {
  const handleClickLink = () => {
    if (typeof props.onClickLinkAction === "function") {
      props.onClickLinkAction();
    }
  };
  return (
    <ul className={styles.container}>
      {props.rating > 0 && props.review_count > 0 && (
        <li>
          <Link
            onClick={handleClickLink}
            href={`/reviews/${props.product_id}`}
            className={styles.item}
          >
            <ReviewSvg />
            <span>
              {props.rating} · {props.review_count}{" "}
              {declOfNum(props.review_count, ["оценка", "оценки", "оценок"])}
            </span>
          </Link>
        </li>
      )}

      {props.questionCount > 0 && (
        <li>
          <Link
            onClick={handleClickLink}
            href={`/questions/${props.product_id}`}
            className={styles.item}
          >
            <QuestionSvg />
            <span>
              {props.questionCount}{" "}
              {declOfNum(props.questionCount, ["вопрос", "вопроса", "вопросов"])}
            </span>
          </Link>
        </li>
      )}
    </ul>
  );
};
