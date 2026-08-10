import Link from "next/link";
import { useState } from "react";
import type { CategoryModel } from "@/app/category/action";
import { BirdSelectIcon } from "@/views/LayoutLeftSide/NavigateMenu/svg/BirdSelectIcon";
import styles from "./CategoryItem.module.css";

type Props = {
  category: CategoryModel;
  onClickLink: () => void;
};

export const CategoryItem = (props: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <li key={props.category.id}>
      {props.category.children.length > 0 ? (
        <div className={styles.buttonContainer}>
          <button
            onClick={() => props.category.children.length > 0 && setIsOpen((prev) => !prev)}
            type="button"
            className={`${styles.categoryLink} ${styles.categoryLinkButton}`}
          >
            <p>{props.category.name}</p>
            <div className={styles.svgContainer}>
              <BirdSelectIcon className="" />
            </div>
          </button>
          {isOpen && props.category.children.length > 0 && (
            <ul className={styles.childrenList}>
              {props.category.children.map((childrenCategory) => (
                <CategoryItem
                  onClickLink={props.onClickLink}
                  key={childrenCategory.id}
                  category={childrenCategory}
                />
              ))}
            </ul>
          )}
        </div>
      ) : (
        <Link
          onClick={props.onClickLink}
          href={`/catalog?category=${props.category.id}`}
          className={styles.categoryLink}
        >
          <p>{props.category.name}</p>
        </Link>
      )}
    </li>
  );
};
