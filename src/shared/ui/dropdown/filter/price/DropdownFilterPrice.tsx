import { useEffect, useState } from "react";
import { Button } from "@/shared/ui/button-main/Button";
import { DropdownFilterWrapper } from "../wrapper/DropdownFilterWrapper";
import styles from "./DropdownFilterPrice.module.css";

type Props = {
  onSubmit: (value: { from: string; to: string }) => void;
  onReset: () => void;
  priceSettings: {
    activeFilterPrice: { from: string; to: string };
    isActive: boolean;
    minPrice: number;
    maxPrice: number;
  };
};

export const DropdownFilterPrice = (props: Props) => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [selectPrice, setSelectPrice] = useState<{ from: string; to: string }>({
    from:
      typeof props.priceSettings.minPrice === "number" ? String(props.priceSettings.minPrice) : "",
    to:
      typeof props.priceSettings.maxPrice === "number" ? String(props.priceSettings.maxPrice) : "",
  });

  useEffect(() => {
    if (
      (props.priceSettings.activeFilterPrice.from &&
        selectPrice.from !== props.priceSettings.activeFilterPrice.from) ||
      (props.priceSettings.activeFilterPrice.to &&
        selectPrice.to !== props.priceSettings.activeFilterPrice.to)
    ) {
      setSelectPrice({
        from: props.priceSettings.activeFilterPrice.from,
        to: props.priceSettings.activeFilterPrice.to,
      });
    }
  }, []);

  const handleChangeInputs = (value: string, field: "from" | "to") => {
    if (/^\d*$/.test(value)) {
      setSelectPrice((prev) => ({
        from: field === "from" ? value : prev.from,
        to: field === "to" ? value : prev.to,
      }));
    }
  };

  const handleResetPrices = () => {
    setSelectPrice({
      from:
        typeof props.priceSettings.minPrice === "number"
          ? String(props.priceSettings.minPrice)
          : "",
      to:
        typeof props.priceSettings.maxPrice === "number"
          ? String(props.priceSettings.maxPrice)
          : "",
    });
    setIsOpenMenu(false);
    props.onReset();
  };

  const valueString = props.priceSettings.isActive
    ? `Цена: от ${props.priceSettings.activeFilterPrice.from} до ${props.priceSettings.activeFilterPrice.to}`
    : "Цена, ₽";

  const onBlurInput = (value: string, field: "from" | "to") => {
    let valueNumber = Number(value);

    if (Number.isNaN(valueNumber)) return;

    if (field === "from") {
      if (valueNumber >= Number(selectPrice.to)) {
        valueNumber = Number(selectPrice.to) - 1;
      }

      if (valueNumber < props.priceSettings.minPrice) {
        valueNumber = props.priceSettings.minPrice;
      }

      setSelectPrice((prev) => ({ ...prev, from: String(valueNumber) }));
    } else {
      if (valueNumber > props.priceSettings.maxPrice) {
        valueNumber = props.priceSettings.maxPrice;
      }

      if (valueNumber <= props.priceSettings.minPrice) {
        valueNumber = props.priceSettings.minPrice + 1;
      }

      setSelectPrice((prev) => ({ ...prev, to: String(valueNumber) }));
    }
  };

  const handleSubmit = () => {
    props.onSubmit(selectPrice);
    setIsOpenMenu(false);
  };

  return (
    <DropdownFilterWrapper
      mobileTitle="Цена"
      onClose={() => setIsOpenMenu(false)}
      onOpen={() => setIsOpenMenu(true)}
      isOpenMenu={isOpenMenu}
      active={props.priceSettings.isActive}
      onReset={handleResetPrices}
      value={valueString}
      menuChildren={
        <div className={styles.menu}>
          <div className={styles.inputsLine}>
            <div className={styles.inputItem}>
              <label htmlFor="price_from" className={styles.labelInput}>
                От
              </label>
              <input
                id="price_from"
                name="price_from"
                value={selectPrice.from}
                onChange={(e) => handleChangeInputs(e.target.value, "from")}
                onBlur={(e) => onBlurInput(e.target.value, "from")}
                className={styles.input}
                autoComplete="off"
                inputMode="numeric"
                type="text"
              />
            </div>
            <div className={styles.inputItem}>
              <label htmlFor="price_to" className={styles.labelInput}>
                До
              </label>
              <input
                id="price_to"
                name="price_to"
                value={selectPrice.to}
                onChange={(e) => handleChangeInputs(e.target.value, "to")}
                onBlur={(e) => onBlurInput(e.target.value, "to")}
                className={styles.input}
                autoComplete="off"
                inputMode="numeric"
                type="text"
              />
            </div>
          </div>
          <div className={styles.buttonLine}>
            {props.priceSettings.isActive && (
              <Button
                customClass={styles.mobileButton}
                fullWidth
                onClick={handleResetPrices}
                size="xs"
              >
                Сбросить
              </Button>
            )}
            <Button
              fullWidth
              variantColor="violet"
              onClick={handleSubmit}
              variant="solid"
              size="xs"
              customClass={styles.mobileButton}
            >
              Готово
            </Button>
          </div>
        </div>
      }
    />
  );
};
