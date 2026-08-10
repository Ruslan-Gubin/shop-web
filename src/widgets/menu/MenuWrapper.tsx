import { fetchCategories } from "@/app/category/action";
import { Menu } from "./Menu";

export const MenuWrapper = async () => {
  const categoriesData = await fetchCategories();

  return <>{Array.isArray(categoriesData.data) && <Menu categories={categoriesData.data} />}</>;
};
