"use client";
import { useLayoutEffect, useState, useTransition } from "react";
import type {
  CreateReviewPayload,
  EditReviewPayload,
  ReviewModel,
} from "@/app/catalog/detail/[id]/action";
import type { ResponseData } from "@/shared/types/response";
import { Button } from "@/shared/ui/button-main/Button";
import { Modal } from "@/shared/ui/modal/Modal";
import { ModalBody } from "@/shared/ui/modal/modal-body/ModalBody";
import { ModalContent } from "@/shared/ui/modal/modal-content/ModalContent";
import { ModalFooter } from "@/shared/ui/modal/modal-footer/ModalFooter";
import { ModalHeader } from "@/shared/ui/modal/modal-header/ModalHeader";
import { TextAreaResize } from "@/shared/ui/text-area-resize/TextAreaResize";
import { notificationAdapter } from "@/stores/notification/adapter";
import { ModalDelete } from "@/widgets/modals/modal-delete/ModalDelete";
import styles from "./ReviewForm.module.css";

type Props = {
  myReview: ReviewModel | null;
  product_id: string;
  createReviewAction: (payload: CreateReviewPayload) => Promise<{
    status: string;
    errors: Record<string, string>;
    data: ReviewModel | null;
    message: string;
  }>;
  editReviewAction: (
    review_id: number,
    payload: EditReviewPayload,
  ) => Promise<{
    status: string;
    errors: Record<string, string>;
    data: ReviewModel | null;
    message: string;
  }>;
  deleteReviewAction: (review_id: number) => Promise<ResponseData<null>>;
};

const STARS = [1, 2, 3, 4, 5];

type ErrorsType = {
  rating: string;
  dignities: string;
  disadvantages: string;
  comment: string;
};

export const ReviewForm = (props: Props) => {
  const [disabled, transition] = useTransition();
  const [active, setActive] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const [modalContent, setModalContent] = useState<{ title: string; subtitle: string }>({
    title: "",
    subtitle: "",
  });
  const [values, setValues] = useState<{
    rating: number;
    dignities: string;
    disadvantages: string;
    comment: string;
  }>({
    rating: 0,
    dignities: "",
    disadvantages: "",
    comment: "",
  });
  const [errors, setErrors] = useState<ErrorsType>({
    rating: "",
    dignities: "",
    disadvantages: "",
    comment: "",
  });

  useLayoutEffect(() => {
    if (props.myReview) {
      setValues({
        rating: props.myReview?.rating || 0,
        dignities: props.myReview.dignities || "",
        disadvantages: props.myReview.disadvantages || "",
        comment: props.myReview.comment || "",
      });
    }
  }, [props.myReview]);

  const handleReset = () => {
    setActive(false);
    setErrors({ comment: "", dignities: "", rating: "", disadvantages: "" });
    setValues({ comment: "", dignities: "", rating: 0, disadvantages: "" });
  };

  const handleCloseModal = () => {
    setActiveModal(false);
  };

  const handleChangeValue = (value: string | number, key: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));

    if (!active) {
      setActive(true);
    }
  };

  const handleDelete = () => {
    setDeleteModal(true);
  };

  const submitReview = () => {
    transition(() => {
      props
        .createReviewAction({
          rating: values.rating,
          dignities: values.dignities.trim(),
          disadvantages: values.disadvantages.trim(),
          comment: values.comment.trim(),
          product_id: props.product_id,
        })
        .then((response) => {
          if (response.status === "success") {
            setModalContent({
              title: "Спасибо за ваш отзыв",
              subtitle: "Отзыв будет опубликован после проверки",
            });
            setActive(false);
            setActiveModal(true);
          } else {
            const updateErrors = { ...errors };

            for (const key in response.errors) {
              const typedKey = key as keyof ErrorsType;

              const value = String(response.errors[key]);

              if (Object.hasOwn(updateErrors, typedKey)) {
                updateErrors[typedKey] = String(value);
              }
            }
            setErrors(updateErrors);
          }
        });
    });
  };

  const submitEditReview = () => {
    transition(() => {
      if (props.myReview?.id) {
        props
          .editReviewAction(props.myReview.id, {
            rating: values.rating,
            dignities: values.dignities.trim(),
            disadvantages: values.disadvantages.trim(),
            comment: values.comment.trim(),
          })
          .then((response) => {
            if (response.status === "success") {
              setModalContent({
                title: "Спасибо за ваш отзыв",
                subtitle: "Ваш отзыв успешно изменен",
              });
              setActiveModal(true);
              setActive(false);
            } else {
              const updateErrors = { ...errors };

              for (const key in response.errors) {
                const typedKey = key as keyof ErrorsType;

                const value = String(response.errors[key]);

                if (Object.hasOwn(updateErrors, typedKey)) {
                  updateErrors[typedKey] = String(value);
                }
              }
              setErrors(updateErrors);
            }
          });
      }
    });
  };

  const submitDeleteReview = () => {
    transition(() => {
      if (props.myReview?.id) {
        props
          .deleteReviewAction(props.myReview.id)
          .then((response) => {
            console.log(response);

            if (response.status === "success") {
              setDeleteModal(false);
              setActive(false);
              handleReset();
              notificationAdapter.add("Ваш отзыв успешно удален", response.status);
            }

            if (response.status === "error" && response.message) {
              notificationAdapter.add(response.message, response.status);
            }
          })
          .catch((error) => {
            notificationAdapter.add(error.message || "Не удалось удалить отзыв", "error");
          });
      }
    });
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
      <ModalDelete
        onClose={() => setDeleteModal(false)}
        title="Вы точно хотите удалить отзыв?"
        disabled={disabled}
        submit={submitDeleteReview}
        isOpen={deleteModal}
      />

      <div className={styles.ratingContainer}>
        {props.myReview && <h3>Ваша оценка</h3>}
        <div className={styles.rating}>
          {STARS.map((star) => (
            <button
              key={star}
              type="button"
              className={`${styles.star} ${star <= values.rating ? styles.starActive : styles.starInactive}`}
              onClick={() => handleChangeValue(star, "rating")}
              aria-label={`Оценка ${star} из 5`}
            >
              ★
            </button>
          ))}
        </div>
        {errors.rating && <span className={styles.ratingError}>{errors.rating}</span>}
      </div>

      {active && (
        <>
          <TextAreaResize
            maxHeight={active ? 99 : 0}
            onClickArea={() => setActive(true)}
            value={values.dignities}
            disabled={false}
            name="dignities"
            label="Достоинства"
            onChange={(value) => handleChangeValue(value, "dignities")}
            error={errors.dignities}
          />

          <TextAreaResize
            maxHeight={active ? 99 : 0}
            onClickArea={() => setActive(true)}
            value={values.disadvantages}
            disabled={false}
            name="disadvantages"
            label="Недостатки"
            onChange={(value) => handleChangeValue(value, "disadvantages")}
            error={errors.disadvantages}
          />

          <TextAreaResize
            maxHeight={active ? 99 : 0}
            onClickArea={() => setActive(true)}
            value={values.comment}
            disabled={false}
            name="comment"
            label="Комментарий"
            onChange={(value) => handleChangeValue(value, "comment")}
            error={errors.comment}
          />
        </>
      )}

      {active && props.myReview === null && values.rating > 0 && (
        <div className={styles.footerActions}>
          <Button disabled={disabled} onClick={submitReview} size="sm" variantColor="violet">
            Оставить отзыв
          </Button>

          {props.myReview === null && (
            <Button size="sm" variantColor="gray" onClick={handleReset}>
              Отменить
            </Button>
          )}
        </div>
      )}

      {props.myReview && (
        <div className={styles.footerActions}>
          <Button
            disabled={disabled}
            onClick={() => (active ? submitEditReview() : setActive(true))}
            size="sm"
            variantColor="violet"
          >
            Изменить отзыв
          </Button>

          <Button size="sm" variantColor="gray" onClick={handleDelete}>
            Удалить
          </Button>
        </div>
      )}
    </>
  );
};
