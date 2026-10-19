import { fetchCategories } from "@/app/action";
import { Menu } from "./Menu";

export const MenuWrapper = async () => {
  const categoriesData = await fetchCategories();

  return (
    <Menu
      errorMessage={
        categoriesData.status === "error" && categoriesData.message.length > 0
          ? categoriesData.message
          : ""
      }
      categories={categoriesData.data || []}
    />
  );
};
