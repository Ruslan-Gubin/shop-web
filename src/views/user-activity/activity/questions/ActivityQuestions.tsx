"use client";
import Link from "next/link";
import { useState } from "react";
import type { QuestionModel } from "@/app/catalog/detail/[id]/action";
import { formatDateLong } from "@/shared/helpers/formatters";
import { useHorizontalScroll } from "@/shared/hooks/useHorizontalScroll";
import { ArrowRightSvg } from "@/shared/svg/ArrowRightSvg";
import type { ResponseData } from "@/shared/types/response";
import { Button } from "@/shared/ui/button-main/Button";
import { Modal } from "@/shared/ui/modal/Modal";
import { ModalBody } from "@/shared/ui/modal/modal-body/ModalBody";
import { ModalContent } from "@/shared/ui/modal/modal-content/ModalContent";
import { ModalFooter } from "@/shared/ui/modal/modal-footer/ModalFooter";
import { ModalHeader } from "@/shared/ui/modal/modal-header/ModalHeader";
import { TextAreaResize } from "@/shared/ui/text-area-resize/TextAreaResize";
import styles from "./ActivityQuestions.module.css";

type Props = {
  questions: QuestionModel[];
  totalCount: number;
  product_id: string;
  createQuestionAction: (
    question: string,
    product_id: string,
  ) => Promise<ResponseData<QuestionModel>>;
};

export const ActivityQuestions = (props: Props) => {
  const [active, setActive] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>("");
  const [questionError, setQuestionError] = useState<string>("");
  const [activeModal, setActiveModal] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<{ title: string; subtitle: string }>({
    title: "",
    subtitle: "",
  });
  const { ref, activeArrows, leftActive, rightActive, handleScroll } = useHorizontalScroll();

  const submitQuestions = () => {
    if (question.length < 10 || question.length >= 1000) {
      setQuestionError("Число символов от 10 до 1000");
    } else {
      props
        .createQuestionAction(question.trim(), props.product_id)
        .then((response) => {
          console.log(response);
          if (response.status === "success") {
            setModalContent({
              title: "Спасибо за ваш вопрос",
              subtitle: "Вопрос будет опубликован вместе с ответом",
            });
            setActive(false);
            setQuestion("");
          } else {
            setModalContent({
              title: "Не удалось создать вопрос",
              subtitle: "Попробуйте в другой раз",
            });
          }
        })
        .finally(() => {
          setActiveModal(true);
        });
    }
  };

  const handleReset = () => {
    setActive(false);
  };

  const handleChangeQuestion = (value: string) => {
    setQuestion(value);
    if (questionError) {
      setQuestionError("");
    }
  };

  const handleCloseModal = () => {
    setActiveModal(false);
  };

  return (
    <>
      <Modal active={activeModal} handleCloseAction={handleCloseModal}>
        <ModalContent>
          <ModalHeader title={modalContent.title} onClose={handleCloseModal} />

          <ModalBody>
            <p className={styles.modalSubtitle}>{modalContent.subtitle}</p>
          </ModalBody>
          <ModalFooter
            submitAction={{
              action: handleCloseModal,
              variant: "solid",
              text: "Закрыть",
              fullWidth: true,
            }}
          />
        </ModalContent>
      </Modal>

      <div className={styles.root}>
        <TextAreaResize
          maxHeight={active ? 99 : 0}
          minHeight={active ? 99 : 0}
          onClickArea={() => setActive(true)}
          value={question}
          disabled={false}
          name="question"
          label="Задайте вопрос о товаре"
          onChange={handleChangeQuestion}
          error={questionError}
        />

        {active && (
          <footer className={styles.footerActions}>
            <Button onClick={submitQuestions} size="sm" variantColor="violet">
              Задать вопрос
            </Button>

            <Button size="sm" variantColor="gray" onClick={handleReset}>
              Отменить
            </Button>
          </footer>
        )}

        {props.questions.length > 0 && (
          <div className={styles.carouselWrapper}>
            <ul ref={ref} className={styles.questionsList}>
              {props.questions.map((questionItem) => (
                <li key={questionItem.id} className={styles.questionsItem}>
                  <header className={styles.questionsHeader}>
                    <h4>Пользователь</h4>
                    <span className={styles.questionDate}>
                      {questionItem.created_at ? formatDateLong(questionItem.created_at) : ""}
                    </span>
                  </header>

                  <p className={styles.questionText}>
                    <Link href={`/questions/${props.product_id}/?question_id=${questionItem.id}`}>
                      {questionItem.question}
                    </Link>
                  </p>
                  <div className={styles.answerContainer}>
                    <Link
                      href={`/questions/${props.product_id}/?question_id=${questionItem.id}`}
                      className={styles.answerTextContainer}
                    >
                      {questionItem.answer.length > 0 && (
                        <p className={styles.answerText}>{questionItem.answer}</p>
                      )}
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
            {activeArrows && (
              <>
                <button
                  type="button"
                  disabled={!leftActive}
                  onClick={() => handleScroll("left")}
                  className={styles.buttonNavigate}
                >
                  <ArrowRightSvg title="Назад" size={{ height: 16, width: 18 }} />
                </button>

                <button
                  type="button"
                  disabled={!rightActive}
                  onClick={() => handleScroll("right")}
                  className={`${styles.buttonNavigate} ${styles.buttonNavigateNext}`}
                >
                  <ArrowRightSvg title="Дальше" size={{ height: 16, width: 18 }} />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};
