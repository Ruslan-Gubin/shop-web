import { AddSvg } from "@/app/category/components/category-item/svg/AddSvg";
import { Button } from "../../button-main/Button";
import styles from "./ModalFooter.module.css";

type ButtonActionType = {
  action?: () => void;
  text?: string;
  disabled?: boolean;
  type?: "submit";
  variantColor?: "teal" | "error" | "green" | "pink" | "blue" | "violet";
  variant?: "solid" | "outline" | "ghost" | "link";
  size?: "xs" | "sm" | "md" | "lg";
  fullWidth?: boolean;
};

type Props = {
  cancelAction?: ButtonActionType;
  addAction?: ButtonActionType;
  submitAction?: ButtonActionType;
};

export const ModalFooter = (props: Props) => {
  return (
    <footer className={styles.footer}>
      {props.addAction && (
        <Button
          disabled={props.addAction.disabled}
          size={props.addAction.size || "sm"}
          variant={props.addAction.variant || "solid"}
          onClick={props.addAction.action}
          type={props.addAction.type || "button"}
          variantColor={props.addAction.variantColor || "violet"}
          fullWidth={props.addAction.fullWidth}
        >
          <AddSvg />
          {props.addAction.text || "Добавить"}
        </Button>
      )}
      {props.cancelAction && (
        <Button
          disabled={props.cancelAction.disabled}
          size={props.cancelAction.size || "sm"}
          variant={props.cancelAction.variant || "solid"}
          onClick={props.cancelAction.action}
          type={props.cancelAction.type || "button"}
          variantColor={props.cancelAction.variantColor || "violet"}
          fullWidth={props.cancelAction.fullWidth}
        >
          {props.cancelAction.text || "Отменить"}
        </Button>
      )}
      {props.submitAction && (
        <Button
          size={props.submitAction.size || "sm"}
          variant={props.submitAction.variant || "solid"}
          variantColor={props.submitAction.variantColor || "violet"}
          disabled={props.submitAction.disabled}
          type={props.submitAction.type || "submit"}
          onClick={props.submitAction.action}
          fullWidth={props.submitAction.fullWidth}
        >
          {props.submitAction.text || "Подтвердить"}
        </Button>
      )}
    </footer>
  );
};
