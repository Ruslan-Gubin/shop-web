"use client";
import { useState } from "react";
import type { QuestionModel } from "@/app/catalog/detail/[id]/action";
import type { ResponseData } from "@/shared/types/response";
import { Button } from "@/shared/ui/button-main/Button";
import { Modal } from "@/shared/ui/modal/Modal";
import { ModalBody } from "@/shared/ui/modal/modal-body/ModalBody";
import { ModalContent } from "@/shared/ui/modal/modal-content/ModalContent";
import { ModalFooter } from "@/shared/ui/modal/modal-footer/ModalFooter";
import { ModalHeader } from "@/shared/ui/modal/modal-header/ModalHeader";
import { TextAreaResize } from "@/shared/ui/text-area-resize/TextAreaResize";
import styles from "./QuestionsForm.module.css";

type Props = {
  product_id: string;
  totalCount: number;
  createQuestionAction: (
    question: string,
    product_id: string,
  ) => Promise<ResponseData<QuestionModel>>;
};

export const QuestionsForm = (props: Props) => {
  const [active, setActive] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>("");
  const [questionError, setQuestionError] = useState<string>("");
  const [activeModal, setActiveModal] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<{ title: string; subtitle: string }>({
    title: "",
    subtitle: "",
  });

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
        <div className={styles.selectItem}>
          <h3>Вопросы</h3>
          {props.totalCount > 0 && <span className={styles.selectCount}>{props.totalCount}</span>}
        </div>

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
      </div>
    </>
  );
};
