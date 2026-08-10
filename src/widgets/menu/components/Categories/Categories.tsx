import Link from "next/link";
import { useState } from "react";
import type { CategoryModel } from "@/app/action";
import { getParentCategory } from "@/shared/helpers/getParentCategory";
import { BirdSelectIcon } from "@/shared/svg/BirdSelectIcon";
import { menuAdapter } from "@/stores/menu/adapter";
import styles from "./Categories.module.css";

type Props = {
  categories: CategoryModel[];
};

export const Categories = (props: Props) => {
  const [hoverMainCategory, setHoverMainCategory] = useState<number | null>(null);
  const [selectCategory, setSelectCategory] = useState<CategoryModel | null>(null);

  const getIsHasChildrenInCategory = (categories: CategoryModel[], id: number) => {
    let isHas = false;

    if (typeof id === "number") {
      for (let i = 0; i < categories.length; i++) {
        const currentCategory = categories[i];
        const hasChildren = currentCategory.children.length > 0;

        if (currentCategory.id === id) {
          isHas = true;
          break;
        }

        if (hasChildren) {
          const findChildrenName = getIsHasChildrenInCategory(currentCategory.children, id);
          if (findChildrenName) {
            isHas = true;
            break;
          }
        }
      }
    }

    return isHas;
  };

  const handleHoverMainCategory = (id: number) => {
    const category = props.categories.find((el) => el.id === id);
    if (!category) return;

    if (!selectCategory) {
      setSelectCategory(category);
    } else {
      const isSelectChildren = getIsHasChildrenInCategory(category.children, selectCategory.id);
      if (!isSelectChildren) {
        setSelectCategory(category);
      }
    }

    if (hoverMainCategory !== id) {
      setHoverMainCategory(id);
    }
  };

  const handleCloseMenu = () => menuAdapter.toggleMenu(false);

  const handleClickSecondMenuItem = (id: number) => {
    const category =
      selectCategory && selectCategory.children.length > 0
        ? selectCategory.children.find((el) => el.id === id)
        : null;

    if (category) {
      setSelectCategory(category);
    }
  };

  const parentCategory = selectCategory
    ? getParentCategory(props.categories, selectCategory.id)
    : null;

  return (
    <>
      <ul className={styles.categoryList}>
        {props.categories.map((category) => (
          <li key={category.id}>
            <Link
              href={category.children.length > 0 ? "" : `/catalog?category=${category.id}`}
              className={`${styles.categoryLink} ${styles.categoryLinkLg} ${hoverMainCategory === category.id ? styles.categoryLinkHover : ""}`}
              onMouseEnter={() => handleHoverMainCategory(category.id)}
              style={{ cursor: category.children.length > 0 ? "default" : "pointer" }}
              onClick={() => category.children.length === 0 && handleCloseMenu()}
            >
              <p>{category.name}</p>
              {category.children.length > 0 && (
                <div className={styles.svgContainer}>
                  <BirdSelectIcon className="" />
                </div>
              )}
            </Link>
            <Link
              href={category.children.length > 0 ? "" : `/catalog?category=${category.id}`}
              className={`${styles.categoryLink} ${styles.categoryLinkSm} ${hoverMainCategory === category.id ? styles.categoryLinkHover : ""}`}
              style={{ cursor: category.children.length > 0 ? "default" : "pointer" }}
              onClick={() => handleHoverMainCategory(category.id)}
            >
              <p>{category.name}</p>
              {category.children.length > 0 && (
                <div className={styles.svgContainer}>
                  <BirdSelectIcon className="" />
                </div>
              )}
            </Link>
          </li>
        ))}
      </ul>
      {selectCategory && selectCategory.children.length > 0 && (
        <ul className={styles.nextCategory}>
          {parentCategory && selectCategory && typeof selectCategory.parent_id === "number" && (
            <button
              type="button"
              className={styles.buttonBack}
              onClick={() => setSelectCategory(parentCategory)}
            >
              <BirdSelectIcon className={styles.buttonBackSvg} />
              <p className={styles.buttonBackText}>{parentCategory.name}</p>
            </button>
          )}
          <h4 className={styles.categoryTitle}>{selectCategory.name}</h4>
          <button
            onClick={() => setSelectCategory(parentCategory)}
            type="button"
            className={styles.categoryMobileTitleContainer}
          >
            <BirdSelectIcon className={styles.buttonBackSvg} />
            <p className={styles.buttonBackText}>{selectCategory.name}</p>
          </button>
          {selectCategory.children.map((category) => (
            <li key={category.id}>
              {category.children.length > 0 ? (
                <button
                  onClick={() =>
                    category.children.length > 0 && handleClickSecondMenuItem(category.id)
                  }
                  type="button"
                  className={`${styles.categoryLink} ${styles.categoryLinkButton}`}
                >
                  <p>{category.name}</p>
                  <div className={styles.svgContainer}>
                    <BirdSelectIcon className="" />
                  </div>
                </button>
              ) : (
                <Link
                  onClick={handleCloseMenu}
                  href={`/catalog?category=${category.id}`}
                  className={styles.categoryLink}
                >
                  <p>{category.name}</p>
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
