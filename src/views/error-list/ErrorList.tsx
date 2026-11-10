import type { ResponseData } from "@/shared/types/response";
import { ErrorAlert } from "@/shared/ui/error-alert/ErrorAlert";
import styles from "./ErrorList.module.css";

type Props = {
  errorsList: ResponseData<unknown>[];
};

export const ErrorList = (props: Props) => {
  const filterFindErrors = props.errorsList.filter(
    (el) => el.status === "error" && typeof el.message === "string" && el.message.length > 0,
  );

  if (filterFindErrors.length === 0) {
    return null;
  }

  return (
    <ul className={styles.root}>
      {filterFindErrors.map((item, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <index>
        <li key={index}>
          <ErrorAlert message={item.message} />
        </li>
      ))}
    </ul>
  );
};
