"use client";
import { useRouter } from "next/navigation";
import type { CategoryModel } from "@/app/action";
import { useMultiValueQueryString } from "@/shared/hooks/useMultiValueQueryString";
import { useUpdateQueryString } from "@/shared/hooks/useUpdateQueryString";
import { DropdownFilterCategory } from "@/shared/ui/dropdown/filter/category/DropdownFilterCategory";
import { DropdownFilterMultiSelect } from "@/shared/ui/dropdown/filter/multi-select/DropdownFilterMultiSelect";
import { DropdownFilterPrice } from "@/shared/ui/dropdown/filter/price/DropdownFilterPrice";
import { DropdownFilterSelect } from "@/shared/ui/dropdown/filter/select/DropdownFilterSelect";
import { DropdownFilterCountry } from "@/shared/ui/dropdown/filter/select-country/DropdownFilterCountry";
import type { CatalogFiltersResponse } from "../../action";
import { FilterLargeSize } from "./components/FilterLargeSize/FilterLargeSize";
import { FilterNormalSize } from "./components/FilterNormalSize/FilterNormalSize";
import styles from "./Filter.module.css";

type Props = {
  priceSettings: {
    activeFilterPrice: { from: string; to: string };
    isActive: boolean;
    minPrice: number;
    maxPrice: number;
  };
  categories: CategoryModel[];
  categoryValue: string;
  selectCategoryId: number;
  mainCategory: CategoryModel | null;
  filters: CatalogFiltersResponse | null;
  searchParams: {
    category?: string;
    search?: string;
    page?: string;
    sort?: string;
    price_from?: string;
    price_to?: string;
    specifications?: string;
    country?: string;
    product_types?: string;
  };
  showSort: boolean;
};

export const Filter = (props: Props) => {
  const router = useRouter();
  const updateQueryString = useUpdateQueryString();
  const updateMultiValueQueryString = useMultiValueQueryString();

  const sortedOptions = [
    { value: "popular", label: "По популярности" },
    { value: "rate", label: "По рейтингу" },
    { value: "price_up", label: "По возрастанию цены" },
    { value: "price_down", label: "По убыванию цены" },
    { value: "new", label: "По новинкам" },
  ];

  const handleChangeSort = (value: string) => {
    const updateUrl = updateQueryString({ sort: value });

    router.push(updateUrl, { scroll: false });
  };

  const handleChangeProductType = (value: string) => {
    const updateValue =
      props.searchParams?.product_types && props.searchParams?.product_types === value ? "" : value;

    const updateUrl = updateQueryString({ product_types: updateValue });

    router.push(updateUrl, { scroll: false });
  };

  const handleChangePrice = (value: { from: string; to: string }) => {
    const updateUrl = updateQueryString({ price_from: value.from, price_to: value.to });

    router.push(updateUrl, { scroll: false });
  };

  const handleResetPrice = () => {
    const updateUrl = updateQueryString({ price_from: "", price_to: "" });

    router.push(updateUrl);
  };

  const handleSelectSpecifications = (specificationId: number, value: string) => {
    const currentSpecs: string[] = props.searchParams.specifications
      ? Array.isArray(props.searchParams.specifications)
        ? props.searchParams.specifications
        : [props.searchParams.specifications]
      : [];

    const specKey = `${specificationId}:${value}`;

    const specKeyIndex = currentSpecs.findIndex((el: string) => el === specKey);

    if (specKeyIndex === -1) {
      currentSpecs.push(specKey);
    } else {
      currentSpecs.splice(specKeyIndex, 1);
      if (currentSpecs.length > 1) {
        currentSpecs.reverse();
      }
    }

    const updateUrl = updateMultiValueQueryString("specifications", currentSpecs);
    router.push(updateUrl);
  };

  const handleResetSpecifications = (values: string[]) => {
    const currentSpecs: string[] = props.searchParams.specifications
      ? Array.isArray(props.searchParams.specifications)
        ? props.searchParams.specifications
        : [props.searchParams.specifications]
      : [];
    const filterSpecs = currentSpecs.filter((el) => !values.includes(el));

    const updateUrl = updateMultiValueQueryString("specifications", filterSpecs);
    router.push(updateUrl);
  };

  const handleSelectCountry = (value: string) => {
    const countryParams: string[] = props.searchParams.country
      ? props.searchParams.country.split(",")
      : [];

    const valueIndex = countryParams.findIndex((el: string) => el === value);

    if (valueIndex === -1) {
      countryParams.push(value);
    } else {
      countryParams.splice(valueIndex, 1);
    }

    const updateUrl = updateQueryString({ country: countryParams.join(",") });

    router.push(updateUrl);
  };

  const handleResetCountry = () => {
    const updateUrl = updateQueryString({ country: "" });

    router.push(updateUrl);
  };

  return (
    <section className={styles.filter}>
      <ul className={styles.filterList}>
        {props.mainCategory && (
          <li>
            <DropdownFilterCategory
              mainCategory={props.mainCategory}
              categories={props.categories}
              value={props.categoryValue}
              onChange={handleChangeSort}
              selectCategoryId={props.selectCategoryId}
            />
          </li>
        )}

        {props.filters && props.filters?.product_types?.length > 1 && (
          <li>
            <DropdownFilterSelect
              placeholder="Вид товара"
              options={props.filters.product_types.map((el) => ({ label: el, value: el }))}
              value={props.searchParams.product_types || ""}
              onChange={handleChangeProductType}
            />
          </li>
        )}
        {props.showSort && (
          <li>
            <DropdownFilterSelect
              placeholder="Сортировка"
              options={sortedOptions}
              value={props.searchParams?.sort || "popular"}
              onChange={handleChangeSort}
            />
          </li>
        )}
        {props.priceSettings.minPrice !== props.priceSettings.maxPrice && (
          <li>
            <DropdownFilterPrice
              priceSettings={props.priceSettings}
              onSubmit={handleChangePrice}
              onReset={handleResetPrice}
            />
          </li>
        )}

        {props.filters?.specifications.map((specification) => (
          <li key={specification.id}>
            <DropdownFilterMultiSelect
              selected={
                props.searchParams.specifications
                  ? Array.isArray(props.searchParams.specifications)
                    ? props.searchParams.specifications
                    : [props.searchParams.specifications]
                  : []
              }
              onReset={handleResetSpecifications}
              onChange={handleSelectSpecifications}
              specification={specification}
            />
          </li>
        ))}

        {props.filters && props.filters?.countries?.length > 1 && (
          <li>
            <DropdownFilterCountry
              title="Производитель"
              selected={props.searchParams.country || ""}
              onReset={handleResetCountry}
              onChange={handleSelectCountry}
              options={props.filters.countries}
            />
          </li>
        )}
      </ul>
      <div className={styles.cartSizeActions}>
        <FilterLargeSize />
        <FilterNormalSize />
      </div>
    </section>
  );
};
