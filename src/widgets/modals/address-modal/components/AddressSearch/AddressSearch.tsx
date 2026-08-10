import { useEffect, useRef, useState } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { CloseSvg } from "@/shared/svg/CloseSvg";
import { PinAddressSvg } from "@/shared/svg/PinAddressSvg";
import { SearchSvg } from "@/shared/svg/SearchSvg";
import { Input } from "@/shared/ui/input-main/Input";
import styles from "./AddressSearch.module.css";

type Props = {
  mapToken: string;
  onSelectCourier: (payload: {
    lng: number;
    lat: number;
    name: string;
    place: string;
    entrance: "";
    flat: "";
    floor: "";
    intercom: "";
    type: "courier";
  }) => void;
  fetchForwardAction: (address: string) => Promise<{
    lng: number;
    lat: number;
    name: string;
    place: string;
  }>;
};

type SuggestResultItem = {
  address: { formatted_address: string; component: { name: string; kind: string[] }[] };
  distance: { value: number; text: string };
  subtitle: { text: string; hl: { begin: number; end: number }[] };
  tags: string[];
  title: { text: string; hl: { begin: number; end: number }[] };
};

type SuggestResponse = {
  suggest_reqid: string;
  results: SuggestResultItem[];
};

type SuggestionItem = {
  name: string;
  place: string;
};

export const AddressSearch = (props: Props) => {
  const [search, setSearch] = useState<string>("");
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const searchListRef = useRef<HTMLUListElement | null>(null);
  const debounceFn = useDebounce();

  const fetchSearchAddress = async (value: string) => {
    const apiKey = "0ebe3f4b-328f-4791-9382-746493053198"; //e9daf74b-d070-4c53-b5c7-170290413f9c

    return fetch(
      `https://suggest-maps.yandex.ru/v1/suggest?apikey=${apiKey}&types=geo&text=${value}&lang=ru_RU&results=10&print_address=1`,
    )
      .then((response) => response.json())
      .then((response: SuggestResponse) => {
        return (response.results || []).map((r) => ({
          name: r.title.text,
          place: r.subtitle?.text ?? "",
        }));
      });
  };

  const handleSelectSuggestion = (item: SuggestionItem) => {
    const address = `${item.place}, ${item.name}`;

    props
      .fetchForwardAction(address)
      .then((payload) => {
        setSearch(
          payload.place === payload.name ? payload.name : `${payload.place}, ${payload.name}`,
        );
        props.onSelectCourier({
          ...payload,
          entrance: "",
          flat: "",
          floor: "",
          intercom: "",
          type: "courier",
        });
      })
      .finally(() => {
        setSuggestions([]);
      });
  };

  const handleChangeSearch = (value: string) => {
    setSearch(value);
    if (value.trim()) {
      debounceFn(() => {
        fetchSearchAddress(value)
          .then((items) => setSuggestions(items))
          .catch(() => setSuggestions([]));
      });
    } else {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined" || !searchListRef.current) return;

    const clickOutside = (e: MouseEvent) => {
      if (
        searchListRef.current &&
        !searchListRef.current.contains(e.target as Node) &&
        suggestions.length > 0
      ) {
        setSuggestions([]);
      }
    };

    window.document.addEventListener("click", clickOutside);

    return () => {
      window.document.removeEventListener("click", clickOutside);
    };
  }, [suggestions]);

  return (
    <section>
      <Input
        value={search}
        onChange={(e) => handleChangeSearch(e.target.value)}
        placeholder="Искать на карте"
        variantSize="md"
        variant="outlined"
        leftIcon={<SearchSvg />}
        onClickRightIcon={() => {
          setSearch("");
          setSuggestions([]);
        }}
        rightIcon={<CloseSvg />}
      />
      {suggestions.length > 0 && (
        <ul ref={searchListRef} className={styles.searchList}>
          {suggestions.map((item) => (
            <li key={`${item.name}_${item.place}`}>
              <button
                onClick={() => handleSelectSuggestion(item)}
                type="button"
                className={styles.searchItemButton}
              >
                <div className={styles.pinSvgContainer}>
                  <PinAddressSvg />
                </div>
                <div className={styles.searchItemInfo}>
                  <span className={styles.itemTitle}>{item.name}</span>
                  <span className={styles.itemSubtitle}>{item.place}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
