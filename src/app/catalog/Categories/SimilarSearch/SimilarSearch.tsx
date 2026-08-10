import Link from "next/link";
import { SearchSvg } from "@/shared/svg/SearchSvg";
import type { SearchModel } from "../../action";
import styles from "./SimilarSearch.module.css";

type Props = {
  similarSearch: SearchModel[];
};

export const SimilarSearch = (props: Props) => {
  return (
    <ul className={styles.similarList}>
      {props.similarSearch.map((item) => (
        <li key={item.id}>
          <Link href={`/catalog?search=${item.text}`} className={styles.similarItem}>
            <div className={styles.svgContainer}>
              <SearchSvg />
            </div>
            <span>{item.text}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};
