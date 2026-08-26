"use client";
import { useEffect, useEffectEvent, useRef } from "react";
import type { CategoryModel } from "@/app/action";
import { debounce } from "@/shared/helpers/debounce";
import { menuAdapter } from "@/stores/menu/adapter";
import { menuStore } from "@/stores/menu/store";
import { Categories } from "./components/Categories/Categories";
import styles from "./Menu.module.css";
import { notificationAdapter } from "@/stores/notification/adapter";

type Props = {
  categories: CategoryModel[];
  errorMessage: string;
};

export const Menu = (props: Props) => {
  const isActiveMenu = menuStore((state) => state.isActiveMenu);
  const menuRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.document.body.style.overflow = isActiveMenu ? "hidden" : "auto";
    }
  }, [isActiveMenu]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const clickOutside = (e: MouseEvent) => {
      if (isActiveMenu && menuRef.current) {
        if (!menuRef.current.contains(e.target as Node)) {
          setTimeout(() => menuAdapter.toggleMenu(false), 0);
        }
      }
    };

    window.document.body.addEventListener("click", clickOutside);

    return () => {
      window.document.body.removeEventListener("click", clickOutside);
    };
  }, [isActiveMenu]);

  const resizeListener = useEffectEvent(() => {
    if (window.innerWidth > 500 && isActiveMenu) {
      menuAdapter.toggleMenu(false);
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const debounceResizeListener = debounce(resizeListener, 200);

    window.addEventListener("resize", debounceResizeListener);

    return () => {
      window.removeEventListener("resize", debounceResizeListener);
    };
  }, []);

  useEffect(() => {
    if (props.errorMessage) {
      notificationAdapter.add(props.errorMessage, "error");
    }
  }, []);

  return (
    <section className={isActiveMenu ? `${styles.root} ${styles.rootActive}` : styles.root}>
      <ul
        ref={menuRef}
        className={isActiveMenu ? `${styles.menu} ${styles.menuActive}` : styles.menu}
      >
        <Categories categories={props.categories} />
      </ul>
    </section>
  );
};
