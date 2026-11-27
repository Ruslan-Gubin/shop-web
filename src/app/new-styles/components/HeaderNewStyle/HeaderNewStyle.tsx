import type { SearchModel } from "@/app/catalog/action";
import { Navbar } from "@/views/Header/Header/components/Navbar/Navbar";
import { HeaderLogo } from "@/views/Header/Header/components/HeaderLogo/HeaderLogo";
import { HeaderSearch } from "@/views/Header/Header/components/HeaderSearch/HeaderSearch";
import { MenuHeader } from "@/views/Header/MenuHeader/MenuHeader";
import styles from "./HeaderNewStyle.module.css";

type Props = {
  popular: string[];
  fetchSuggestionsAction: (
    searchValue: string,
  ) => Promise<SearchModel[] | null>;
};

export const HeaderNewStyle = (props: Props) => {
  return (
    <div className={styles.headerWrapper}>
      <div className={styles.headerLeftSide}>
        <HeaderLogo />
        <MenuHeader />
      </div>
      <HeaderSearch
        popular={props.popular}
        fetchSuggestionsAction={props.fetchSuggestionsAction}
      />
      <div className={styles.navbarContainer}>
        <Navbar />
      </div>
    </div>
  );
};
