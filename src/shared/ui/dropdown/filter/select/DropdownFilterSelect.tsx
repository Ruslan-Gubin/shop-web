import { useState } from "react";
import { Checkbox } from "../../../checkbox/Checkbox";
import { DropdownFilterWrapper } from "../wrapper/DropdownFilterWrapper";
import styles from "./DropdownFilterSelect.module.css";

type Props = {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
};

export const DropdownFilterSelect = (props: Props) => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  return (
    <DropdownFilterWrapper
      isOpenMenu={isOpenMenu}
      onOpen={() => setIsOpenMenu(true)}
      onSubmitFooter={() => setIsOpenMenu(false)}
      onClose={() => setIsOpenMenu(false)}
      value={props.options.find((el) => el.value === props.value)?.label || ""}
      mobileTitle="Сортировка"
      menuChildren={
        <ul className={styles.menu}>
          {props.options.map((option) => (
            <li key={option.value} className={styles.menuItem}>
              <Checkbox
                checked={props.value === option.value}
                onChange={() => props.onChange(option.value)}
                isRect
                labelText={option.label}
              />
            </li>
          ))}
        </ul>
      }
    />
  );
};
