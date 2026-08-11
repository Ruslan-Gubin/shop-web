export const getDecodeBrandName = (brand_name: string) => {
  let name = "";

  try {
    name = decodeURIComponent(brand_name || "");
  } catch {
    name = brand_name || "";
  }
  return name;
};
