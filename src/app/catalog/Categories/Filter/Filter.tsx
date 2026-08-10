"use client";
import { useRouter } from "next/navigation";
import type { CategoryModel } from "@/app/category/action";
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

  const handleSelectProductType = (value: string) => {
    const productTypeParams: string[] = props.searchParams.product_types
      ? props.searchParams.product_types.split(",")
      : [];

    const valueIndex = productTypeParams.findIndex((el: string) => el === value);

    if (valueIndex === -1) {
      productTypeParams.push(value);
    } else {
      productTypeParams.splice(valueIndex, 1);
    }

    const updateUrl = updateQueryString({ product_types: productTypeParams.join(",") });

    router.push(updateUrl);
  };

  const handleResetProductType = () => {
    const updateUrl = updateQueryString({ product_types: "" });

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
        <li>
          <DropdownFilterSelect
            options={sortedOptions}
            value={props.searchParams?.sort || "popular"}
            onChange={handleChangeSort}
          />
        </li>
        <li>
          <DropdownFilterPrice
            priceSettings={props.priceSettings}
            onSubmit={handleChangePrice}
            onReset={handleResetPrice}
          />
        </li>

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

        {props.filters && props.filters?.countries?.length > 0 && (
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

        {props.filters && props.filters?.product_types?.length > 0 && (
          <li>
            <DropdownFilterCountry
              title="Вид товара"
              selected={props.searchParams.product_types || ""}
              onReset={handleResetProductType}
              onChange={handleSelectProductType}
              options={props.filters?.product_types || []}
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
