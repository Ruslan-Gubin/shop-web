import { useState } from "react";
import { Checkbox } from "@/shared/ui/checkbox/Checkbox";
import { DropdownFilterWrapper } from "../wrapper/DropdownFilterWrapper";
import styles from "./DropdownFilterMultiSelect.module.css";

type Props = {
  selected: string[];
  onChange: (specificationId: number, value: string) => void;
  onReset: (values: string[]) => void;
  specification: {
    id: number;
    name: string;
    type: string;
    values: string[];
  };
};

export const DropdownFilterMultiSelect = (props: Props) => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const activeCount = props.specification.values.reduce(
    (acc, el) => (props.selected.includes(`${props.specification.id}:${el}`) ? acc + 1 : acc),
    0,
  );

  const valueString = `${props.specification.name} ${activeCount ? activeCount.toString() : ""}`;
  return (
    <DropdownFilterWrapper
      mobileTitle={props.specification.name}
      onOpen={() => setIsOpenMenu(true)}
      isOpenMenu={isOpenMenu}
      onSubmitFooter={() => setIsOpenMenu(false)}
      onClose={() => setIsOpenMenu(false)}
      active={activeCount > 0}
      onReset={() =>
        props.onReset(
          props.specification.values.map((value) => `${props.specification.id}:${value}`),
        )
      }
      value={valueString}
      menuChildren={
        <ul className={styles.menu}>
          {props.specification.values.map((value) => (
            <li key={value} className={styles.menuItem}>
              <Checkbox
                checked={props.selected.includes(`${props.specification.id}:${value}`)}
                onChange={() => props.onChange(props.specification.id, value)}
                labelText={value}
              />
            </li>
          ))}
        </ul>
      }
    />
  );
};
