"use client";
import { useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useLayoutEffect, useRef, useState } from "react";
import type { ReviewModel } from "@/app/catalog/detail/[id]/action";
import { formatDateLong } from "@/shared/helpers/formatters";
import { getUpdateQueryPageString } from "@/shared/helpers/getUpdateQueryPageString";
import { LoadMoreObserver } from "@/shared/ui/load-more-observer/LoadMoreObserver";
import styles from "./ReviewsList.module.css";

type Props = {
  reviews: ReviewModel[];
  isLoadMoreDisabled: boolean;
  patch: string;
  searchParams: { [key: string]: string | string[] | undefined };
  showFullWidth: boolean;
  isHomePage?: boolean;
  limit: number;
  total: number;
  review_id: string;
};

const STARS = [1, 2, 3, 4, 5];

export const ReviewsList = (props: Props) => {
  const [data, setData] = useState<ReviewModel[]>([]);
  const router = useRouter();
  const currentPage: number = Number(props.searchParams.page || "1");
  const refList = useRef<HTMLUListElement | null>(null);

  const getUpdateDataEvent = useEffectEvent((reviews: ReviewModel[]) => {
    const updateData: ReviewModel[] = [];

    const isValidPageData = data.length === props.limit * (currentPage - 1);

    if (!isValidPageData && currentPage > 1) {
      router.push(getUpdateQueryPageString(props.patch, props.searchParams, 1));
    } else {
      if (currentPage > 1) {
        for (let i = 0; i < data.length; i++) {
          updateData.push(data[i]);
        }
      }

      for (let i = 0; i < reviews.length; i++) {
        if (updateData.findIndex((el) => el.id === reviews[i].id) === -1) {
          updateData.push(reviews[i]);
        }
      }
    }

    setData(updateData);
  });

  useLayoutEffect(() => {
    getUpdateDataEvent(props.reviews);
  }, [props.reviews]);

  useEffect(() => {
    if (
      refList.current &&
      typeof window !== "undefined" &&
      props.review_id &&
      props.reviews.some((el) => el.id === Number(props.review_id))
    ) {
      const node = refList.current;

      let findElement = null;
      node.childNodes.forEach((el) => {
        if ("id" in el && el.id === props.review_id) {
          findElement = el;
        }
      });

      if (findElement) {
        //@ts-expect-error findElement is a child node with getBoundingClientRect
        const rect = findElement.getBoundingClientRect();
        if (rect.top) {
          window.scrollTo({ top: rect.top - 120, behavior: "smooth" });
        }
      }
    }
  }, [props.review_id, refList]);

  const isValidDataFromGetMore =
    data.length === currentPage * props.limit && data.length < props.total;

  return (
    <div className={styles.productsList}>
      <ul ref={refList} className={styles.reviewsList}>
        {(data.length > 0 ? data : props.reviews).map((reviewItem) => (
          <li id={String(reviewItem.id)} key={reviewItem.id} className={styles.reviewItem}>
            <header className={styles.reviewHeader}>
              <div className={styles.headerLeftSide}>
                <h4>Пользователь</h4>
                <span className={styles.reviewDate}>
                  {reviewItem.created_at
                    ? formatDateLong(reviewItem.created_at, {
                        minute: "2-digit",
                        second: "2-digit",
                      })
                    : ""}
                </span>
              </div>
              <ul className={styles.ratingList}>
                {STARS.map((star) => (
                  <li
                    key={star}
                    className={`${styles.reviewStar} ${star <= reviewItem.rating ? styles.starActive : styles.reviewStarInactive}`}
                  >
                    ★
                  </li>
                ))}
              </ul>
            </header>

            {reviewItem.dignities.length > 0 && (
              <p className={styles.reviewText}>
                <span className={styles.reviewLabel}>Достоинства:</span>
                {reviewItem.dignities}
              </p>
            )}

            {reviewItem.disadvantages.length > 0 && (
              <p className={styles.reviewText}>
                <span className={styles.reviewLabel}>Недостатки:</span>
                {reviewItem.disadvantages}
              </p>
            )}

            {reviewItem.comment.length > 0 && (
              <p className={styles.reviewText}>
                <span className={styles.reviewLabel}>Комментарий:</span>
                {reviewItem.comment}
              </p>
            )}

            {reviewItem.answer.length > 0 && (
              <div className={styles.answerContainer}>
                <p className={styles.answerText}>{reviewItem.answer}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
      <LoadMoreObserver
        disabled={props.isLoadMoreDisabled || !isValidDataFromGetMore}
        patch={props.patch}
        searchParams={props.searchParams}
        isValidDataFromPage={isValidDataFromGetMore}
        currentPage={currentPage}
      />
    </div>
  );
};
