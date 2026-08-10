"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  type MouseEvent as ReactMouseEvent,
  type SubmitEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import type { SearchModel } from "@/app/catalog/action";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { CloseSvg } from "@/shared/svg/CloseSvg";
import { HistorySvg } from "@/shared/svg/HistorySvg";
import { SearchSvg } from "@/shared/svg/SearchSvg";
import { searchAdapter } from "@/stores/search/adapter";
import { searchStore } from "@/stores/search/store";
import styles from "./HeaderSearch.module.css";

type Props = {
  fetchSuggestionsAction: (searchValue: string) => Promise<SearchModel[] | null>;
  popular: string[];
};

export const HeaderSearch = (props: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const history = searchStore((store) => store.history);
  const [search, setSearch] = useState<string>("");
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const cancelInputRef = useRef<HTMLButtonElement | null>(null);
  const [findItems, setFindItems] = useState<string[]>([]);
  const debounceFn = useDebounce();

  useEffect(() => {
    if (pathname !== "/catalog") {
      setSearch("");
    } else {
      const searchValue = params.get("search");
      setSearch(searchValue ? searchValue : "");
    }
  }, [pathname, params]);

  const getHistoryList = (history: string[]) => {
    const historyList = [];

    if (search.length === 0) {
      historyList.push(...history);
    } else {
      for (let i = 0; i < history.length; i++) {
        const historyItem = history[i];
        if (historyItem.startsWith(search)) {
          historyList.push(historyItem);
        }
      }
    }

    return historyList.slice(0, 5);
  };

  const historyList = getHistoryList(history);

  const getSearchList = (history: string[], findItems: string[], search: string) => {
    const searchList = [];

    if (search.length === 0) {
      searchList.push(...props.popular);
    } else {
      if (findItems.length > 0) {
        searchList.push(...findItems);
      }
    }

    return searchList.filter((el) => !history.includes(el));
  };

  const searchList = getSearchList(history, findItems, search);

  const handleChangeSearch = (value: string) => {
    setSearch(value);

    if (value.length >= 3) {
      debounceFn(() => {
        props.fetchSuggestionsAction(value).then((response) => {
          if (response) {
            setFindItems(response.map((el) => el.text));
          }
        });
      });
    }
  };

  const handleSubmitInput: SubmitEventHandler<HTMLFormElement | undefined> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchValue = formData.get("search");
    const trimValue = String(searchValue).trim();

    if (trimValue.length > 0) {
      if (inputRef.current) {
        inputRef.current.blur();
      }

      searchAdapter.addHistory(trimValue);
      setOpenMenu(false);
      router.push(`/catalog?search=${trimValue}`);
    }
  };

  const handleClickInput = () => {
    if (search.length > 0) {
      props.fetchSuggestionsAction(search).then((response) => {
        if (response) {
          setFindItems(response.map((el) => el.text));
          setOpenMenu(true);
        }
      });
    } else {
      setOpenMenu(true);
    }
  };

  const handleCancelSearch = () => {
    setSearch("");

    if (inputRef.current) {
      inputRef.current.focus();
    }

    if (!openMenu) {
      setOpenMenu(true);
    }
  };

  useEffect(() => {
    if (!rootRef.current || !cancelInputRef.current) return;

    const clickOutside = (e: MouseEvent) => {
      if (
        rootRef.current &&
        !rootRef.current.contains(e.target as Node) &&
        cancelInputRef.current &&
        !cancelInputRef.current.contains(e.target as Node)
      ) {
        setOpenMenu(false);
      }
    };

    window.document.body.addEventListener("click", clickOutside);

    return () => {
      window.document.body.removeEventListener("click", clickOutside);
    };
  }, []);

  const handleClickSearchItem = (value: string) => {
    searchAdapter.addHistory(value);
    setSearch(value);
    setOpenMenu(false);
    searchAdapter.sortedHistory(value);
  };

  const handleClickHistoryItem = (value: string) => {
    setSearch(value);
    setOpenMenu(false);
    searchAdapter.sortedHistory(value);
    router.push(`/catalog?search=${value}`);
  };

  const handleDeleteHistoryItem = (e: ReactMouseEvent<HTMLButtonElement>, value: string) => {
    e.stopPropagation();
    searchAdapter.deleteHistory(value);
  };

  return (
    <div ref={rootRef} className={styles.root}>
      <form onSubmit={handleSubmitInput}>
        <input
          ref={inputRef}
          onClick={handleClickInput}
          value={search}
          onChange={(e) => handleChangeSearch(e.target.value)}
          className={styles.input}
          placeholder="Найти товары"
          autoComplete="off"
          name="search"
        />
      </form>
      <button
        ref={cancelInputRef}
        onClick={handleCancelSearch}
        type="button"
        disabled={search.length === 0}
        className={styles.closeSvgButton}
      >
        <CloseSvg />
      </button>
      {openMenu && (
        <div className={styles.searchWrapper}>
          <ul className={styles.searchList}>
            {historyList.length > 0 && (
              <>
                {search.length === 0 && <li className={styles.searchListTitle}>Вы искали</li>}
                {historyList.map((item) => (
                  <li
                    key={item}
                    onClick={() => handleClickHistoryItem(item)}
                    className={styles.searchListItem}
                  >
                    <div className={styles.searchListItemSvgContainer}>
                      <HistorySvg />
                    </div>
                    <p>{item}</p>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteHistoryItem(e, item)}
                      className={`${styles.searchListItemSvgContainer} ${styles.searchListItemSvgContainerClose}`}
                    >
                      <CloseSvg />
                    </button>
                  </li>
                ))}
              </>
            )}
            {searchList.length > 0 && (
              <>
                {search.length === 0 && <li className={styles.searchListTitle}>Часто ищут</li>}
                {searchList.map((item) => (
                  <li key={item}>
                    <Link
                      onClick={() => handleClickSearchItem(item)}
                      className={styles.searchListItem}
                      href={`/catalog?search=${item}`}
                    >
                      <div
                        className={`${styles.searchListItemSvgContainer} ${styles.searchListItemSvgContainerSearch}`}
                      >
                        <SearchSvg />
                      </div>
                      <p>{item}</p>
                    </Link>
                  </li>
                ))}
              </>
            )}
            {searchList.length === 0 && historyList.length === 0 && search.length > 0 && (
              <li>
                <Link
                  onClick={() => handleClickSearchItem(search)}
                  className={styles.searchListItem}
                  href={`/catalog?search=${search}`}
                >
                  <div
                    className={`${styles.searchListItemSvgContainer} ${styles.searchListItemSvgContainerSearch}`}
                  >
                    <SearchSvg />
                  </div>
                  <p>{search}</p>
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
