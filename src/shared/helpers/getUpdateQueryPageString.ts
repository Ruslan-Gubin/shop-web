export const getUpdateQueryPageString = (
  patch: string,
  searchParams: { [key: string]: string | string[] | undefined },
  page: number,
) => {
  const params = new URLSearchParams();

  params.set("page", String(page));

  for (const key in searchParams) {
    if (key !== "page" && searchParams[key]) {
      const value = searchParams[key];

      if (typeof value === "string") {
        params.set(key, value);
      } else if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          params.append(key, value[i]);
        }
      }
    }
  }

  return `${patch}?${params.toString()}`;
};
