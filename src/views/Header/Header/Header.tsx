import type { SearchModel } from "@/app/catalog/action";
import { MenuHeader } from "../MenuHeader/MenuHeader";
import { HeaderLogo } from "./components/HeaderLogo/HeaderLogo";
import { HeaderSearch } from "./components/HeaderSearch/HeaderSearch";
import { Navbar } from "./components/Navbar/Navbar";
import styles from "./Header.module.css";

type Props = {
  fetchSuggestionsAction: (searchValue: string) => Promise<SearchModel[] | null>;
  fetchPopularSearchAction: () => Promise<SearchModel[] | null>;
};

export const Header = async (props: Props) => {
  const popular = await props.fetchPopularSearchAction();
  const popularList = Array.isArray(popular) ? popular.map((el) => el.text) : [];

  return (
    <aside className={styles.headerWrapper}>
      <aside className={styles.headerLeftSide}>
        <HeaderLogo />
        <MenuHeader />
      </aside>
      <HeaderSearch popular={popularList} fetchSuggestionsAction={props.fetchSuggestionsAction} />

      <aside className={styles.navbarContainer}>
        <Navbar />
      </aside>
    </aside>
  );
};
