"use client";
import { useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useLayoutEffect, useRef, useState } from "react";
import type { QuestionModel } from "@/app/catalog/detail/[id]/action";
import { formatDateLong } from "@/shared/helpers/formatters";
import { getUpdateQueryPageString } from "@/shared/helpers/getUpdateQueryPageString";
import { LoadMoreObserver } from "@/shared/ui/load-more-observer/LoadMoreObserver";
import styles from "./QuestionsList.module.css";

type Props = {
  questions: QuestionModel[];
  isLoadMoreDisabled: boolean;
  patch: string;
  searchParams: { [key: string]: string | string[] | undefined };
  showFullWidth: boolean;
  isHomePage?: boolean;
  limit: number;
  total: number;
  question_id: string;
};

export const QuestionsList = (props: Props) => {
  const [data, setData] = useState<QuestionModel[]>([]);
  const router = useRouter();
  const currentPage: number = Number(props.searchParams.page || "1");
  const refList = useRef<HTMLUListElement | null>(null);

  const getUpdateDataEvent = useEffectEvent((questions: QuestionModel[]) => {
    const updateData: QuestionModel[] = [];

    const isValidPageData = data.length === props.limit * (currentPage - 1);

    if (!isValidPageData && currentPage > 1) {
      router.push(getUpdateQueryPageString(props.patch, props.searchParams, 1));
    } else {
      if (currentPage > 1) {
        for (let i = 0; i < data.length; i++) {
          updateData.push(data[i]);
        }
      }

      for (let i = 0; i < questions.length; i++) {
        if (updateData.findIndex((el) => el.id === questions[i].id) === -1) {
          updateData.push(questions[i]);
        }
      }
    }

    setData(updateData);
  });

  useLayoutEffect(() => {
    getUpdateDataEvent(props.questions);
  }, [props.questions]);

  useEffect(() => {
    if (
      refList.current &&
      typeof window !== "undefined" &&
      props.question_id &&
      props.questions.some((el) => el.id === Number(props.question_id))
    ) {
      const node = refList.current;

      let findElement = null;
      node.childNodes.forEach((el) => {
        if ("id" in el && el.id === props.question_id) {
          findElement = el;
        }
      });

      if (findElement) {
        //@ts-ignore
        const rect = findElement.getBoundingClientRect();
        if (rect.top) {
          window.scrollTo({ top: rect.top - 120, behavior: "smooth" });
        }
      }
    }
  }, [props.question_id, refList]);

  const isValidDataFromGetMore =
    data.length === currentPage * props.limit && data.length < props.total;

  return (
    <div className={styles.productsList}>
      <ul ref={refList} className={styles.questionsList}>
        {(data.length > 0 ? data : props.questions).map((questionItem) => (
          <li id={String(questionItem.id)} key={questionItem.id} className={styles.questionsItem}>
            <header className={styles.questionsHeader}>
              <h4>Пользователь</h4>
              <span className={styles.questionDate}>
                {questionItem.created_at
                  ? formatDateLong(questionItem.created_at, {
                      minute: "2-digit",
                      second: "2-digit",
                    })
                  : ""}
              </span>
            </header>

            <p>{questionItem.question}</p>
            <div className={styles.answerContainer}>
              <p className={styles.answerText}>{questionItem.answer}</p>
            </div>
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
