"use client";
import { CloseSvg } from "@/shared/svg/CloseSvg";
import { MenuSvg } from "@/shared/svg/MenuSvg";
import { menuAdapter } from "@/stores/menu/adapter";
import { menuStore } from "@/stores/menu/store";
import styles from "./MenuHeader.module.css";

export const MenuHeader = () => {
  const isActiveMenu = menuStore((state) => state.isActiveMenu);

  const handleToggleMenu = () => {
    if (typeof window !== "undefined") {
      menuAdapter.toggleMenu(!isActiveMenu);
    }
  };

  return (
    <button type="button" onClick={handleToggleMenu} className={styles.mobileMenuHeader}>
      <div className={styles.svgContainer}>{isActiveMenu ? <CloseSvg /> : <MenuSvg />}</div>
      Каталог
    </button>
  );
};
