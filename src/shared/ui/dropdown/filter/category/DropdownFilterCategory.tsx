import Link from "next/link";
import { useLayoutEffect, useState } from "react";
import type { CategoryModel } from "@/app/action";
import { getParentCategory } from "@/shared/helpers/getParentCategory";
import { BirdSelectIcon } from "@/shared/svg/BirdSelectIcon";
import { DropdownFilterWrapper } from "../wrapper/DropdownFilterWrapper";
import { CategoryItem } from "./components/CategoryItem";
import styles from "./DropdownFilterCategory.module.css";

type Props = {
  value: string;
  onChange: (value: string) => void;
  categories: CategoryModel[];
  selectCategoryId: number;
  mainCategory: CategoryModel | null;
};

export const DropdownFilterCategory = (props: Props) => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [selectCategory, setSelectCategory] = useState<CategoryModel | null>(null);

  const getCategory = (categories: CategoryModel[], id: number): CategoryModel | null => {
    let category: CategoryModel | null = null;

    for (let i = 0; i < categories.length; i++) {
      const currentCategory = categories[i];
      const hasChildren = currentCategory.children.length > 0;

      if (currentCategory.id === id) {
        category = currentCategory;
        break;
      }

      if (hasChildren) {
        const findChildren = getCategory(currentCategory.children, id);
        if (findChildren) {
          category = findChildren;
          break;
        }
      }
    }

    return category;
  };

  useLayoutEffect(() => {
    if (props.mainCategory) {
      const category = getCategory(props.mainCategory.children, props.selectCategoryId);
      setSelectCategory(category ? category : props.mainCategory);
    }
  }, [props.categories, props.selectCategoryId, props.mainCategory]);

  const parentCategory = selectCategory
    ? getParentCategory(props.categories, selectCategory.id)
    : null;

  return (
    <DropdownFilterWrapper
      mobileTitle={"Категория"}
      onOpen={() => setIsOpenMenu(true)}
      isOpenMenu={isOpenMenu}
      onSubmitFooter={() => setIsOpenMenu(false)}
      onClose={() => setIsOpenMenu(false)}
      value={props.value}
      menuChildren={
        <div>
          <header className={styles.header}>
            {parentCategory && selectCategory && typeof selectCategory.parent_id === "number" && (
              <button
                type="button"
                className={styles.buttonBack}
                onClick={() => setSelectCategory(parentCategory)}
              >
                <BirdSelectIcon className={styles.buttonBackSvg} />
                <p className={styles.buttonBackText}>{parentCategory?.name || ""}</p>
              </button>
            )}
            {selectCategory && (
              <Link
                onClick={() => setIsOpenMenu(false)}
                href={`/catalog?category=${selectCategory.id}`}
              >
                <h4 className={styles.categoryTitle}>{selectCategory?.name || ""}</h4>
              </Link>
            )}
          </header>

          {selectCategory && (
            <ul className={styles.nextCategory}>
              {selectCategory.children.map((category) => (
                <CategoryItem
                  onClickLink={() => setIsOpenMenu(false)}
                  key={category.id}
                  category={category}
                />
              ))}
            </ul>
          )}
        </div>
      }
    />
  );
};
