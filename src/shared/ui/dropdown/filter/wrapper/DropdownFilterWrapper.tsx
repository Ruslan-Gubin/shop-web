import { useEffect, useRef, useState } from "react";
import { debounce } from "@/shared/helpers/debounce";
import { ArrowIcon } from "@/shared/svg/ArrowIcon";
import { CancelSvg } from "@/shared/svg/CancelSvg";
import { Button } from "@/shared/ui/button-main/Button";
import styles from "./DropdownFilterWrapper.module.css";

type Props = {
  value: string;
  menuChildren: React.ReactElement;
  active?: boolean;
  onReset?: () => void;
  isOpenMenu?: boolean;
  onClose?: () => void;
  onSubmitFooter?: () => void;
  onOpen: () => void;
  mobileTitle: string;
};

export const DropdownFilterWrapper = (props: Props) => {
  const [offset, setOffset] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const node = ref.current;

    const hoverListener = () => {
      if (window.innerWidth > 880) {
        const rect = node.getBoundingClientRect();
        const reserve = window.innerWidth > 1200 ? 32 : 24;
        const menuRightEdge = rect.left + 296 + reserve;
        const overflow = menuRightEdge - window.innerWidth;

        setOffset(overflow > 0);
      }
    };

    const hoverListenerDebounce = debounce(hoverListener, 300);

    window.addEventListener("resize", hoverListenerDebounce);
    node.addEventListener("mouseenter", hoverListener);

    return () => {
      window.removeEventListener("resize", hoverListenerDebounce);
      node.removeEventListener("mouseenter", hoverListener);
    };
  }, []);

  const handleOpenMobileMenu = () => {
    if (typeof window !== "undefined" && window.innerWidth <= 880) {
      props.onOpen();
    }
  };

  return (
    <>
      <div
        ref={ref}
        onClick={handleOpenMobileMenu}
        className={`${styles.dropdown} ${props.active ? styles.dropdownActive : ""}`}
      >
        <span>{props.value}</span>
        {!props.active && (
          <div className={styles.svgContainer}>
            <ArrowIcon />
          </div>
        )}
        {props.active && typeof props.onReset === "function" && (
          <button
            className={styles.resetButton}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (props.onReset) {
                props.onReset();
              }
            }}
          >
            <CancelSvg />
          </button>
        )}
        <div className={styles.bridge}></div>
        <div
          className={`${styles.menuContainer} ${props.isOpenMenu ? styles.menuOpenMobile : ""} ${offset ? styles.menuContainerRightSide : ""}`}
        >
          {props.menuChildren}
        </div>
      </div>

      <div
        onClick={props.onClose}
        className={props.isOpenMenu ? `${styles.overlay} ${styles.overlayActive}` : styles.overlay}
      ></div>

      <div
        className={
          props.isOpenMenu ? `${styles.menuMobile} ${styles.menuMobileActive}` : styles.menuMobile
        }
      >
        <header className={styles.headerMenu}>
          <h3>{props.mobileTitle || ""}</h3>
          <button onClick={props.onClose} type="button" className={styles.buttonSvg}>
            <CancelSvg />
          </button>
        </header>
        {props.menuChildren}

        {props.onSubmitFooter && (
          <Button
            customClass={styles.footerSubmitButton}
            fullWidth
            variantColor="violet"
            variant="solid"
            size="md"
            onClick={props.onSubmitFooter}
          >
            Готово
          </Button>
        )}
      </div>
    </>
  );
};
