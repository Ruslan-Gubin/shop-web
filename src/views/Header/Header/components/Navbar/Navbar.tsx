"use client";
import { usePathname } from "next/navigation";
import { CartSvg } from "@/shared/svg/CartSvg";
import { HomeSvg } from "@/shared/svg/HomeSvg";
import { MenuSvg } from "@/shared/svg/MenuSvg";
import { NavigateHeart } from "@/shared/svg/NavigateHeart";
import { NavigateOrdersSvg } from "@/shared/svg/NavigateOrdersSvg";
import { UserSvg } from "@/shared/svg/UserSvg";
import { NavbarItem } from "@/shared/ui/navbar-item/NavbarItem";
import { basketStore } from "@/stores/basket/store";
import { favoritesStore } from "@/stores/favorites/store";
import { menuAdapter } from "@/stores/menu/adapter";
import { menuStore } from "@/stores/menu/store";
import styles from "./Navbar.module.css";

export const Navbar = () => {
  const isActiveMenu = menuStore((state) => state.isActiveMenu);
  const pathname = usePathname();
  const totalCount = basketStore((state) => state.totalCount);
  const favorites = favoritesStore((state) => state.items);

  const checkUserName = true;
  const favoritesCount = Object.keys(favorites).reduce((acc) => acc + 1, 0);
  const ordersCount = 0;

  const handleToggleMenu = () => {
    if (!isActiveMenu) {
      menuAdapter.toggleMenu(true);
    }
  };

  return (
    <ul className={styles.root}>
      <NavbarItem
        active={!isActiveMenu && pathname === "/"}
        count={ordersCount}
        href="/"
        label=""
        svg={<HomeSvg />}
        showOnlyTablet
      />
      <NavbarItem
        disabled={isActiveMenu}
        onClick={handleToggleMenu}
        showOnlyTablet
        active={isActiveMenu}
        label=""
        href=""
        svg={<MenuSvg />}
      />
      <NavbarItem
        active={!isActiveMenu && pathname === "/orders"}
        count={ordersCount}
        href="/orders"
        label="Заказы"
        svg={<NavigateOrdersSvg />}
        showOnlyDesktops
      />
      <NavbarItem
        active={!isActiveMenu && pathname === "/favorites"}
        count={favoritesCount}
        href="/favorites"
        label="Избранное"
        svg={<NavigateHeart />}
      />
      <NavbarItem
        active={(!isActiveMenu && pathname === "/profile") || pathname === "/login"}
        href={checkUserName ? "/profile" : "/login"}
        label={checkUserName ? "Профиль" : "Войти"}
        svg={<UserSvg />}
      />
      <NavbarItem
        active={!isActiveMenu && pathname === "/basket"}
        count={totalCount}
        href="/basket"
        label="Корзина"
        svg={<CartSvg />}
      />
    </ul>
  );
};
