import { useState } from "react";
import { Checkbox } from "@/shared/ui/checkbox/Checkbox";
import { DropdownFilterWrapper } from "../wrapper/DropdownFilterWrapper";
import styles from "./DropdownFilterCountry.module.css";

type Props = {
  selected: string;
  onChange: (value: string) => void;
  onReset: () => void;
  options: string[];
  title: string;
};

export const DropdownFilterCountry = (props: Props) => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const activeCount = props.selected ? props.selected.split(",").length : 0;

  const valueString = `${props.title} ${activeCount ? activeCount.toString() : ""}`;
  return (
    <DropdownFilterWrapper
      mobileTitle={props.title}
      onOpen={() => setIsOpenMenu(true)}
      isOpenMenu={isOpenMenu}
      onSubmitFooter={() => setIsOpenMenu(false)}
      onClose={() => setIsOpenMenu(false)}
      active={activeCount > 0}
      onReset={props.onReset}
      value={valueString}
      menuChildren={
        <ul className={styles.menu}>
          {props.options.map((value) => (
            <li key={value} className={styles.menuItem}>
              <Checkbox
                checked={props.selected.includes(value)}
                onChange={() => props.onChange(value)}
                labelText={value}
              />
            </li>
          ))}
        </ul>
      }
    />
  );
};
