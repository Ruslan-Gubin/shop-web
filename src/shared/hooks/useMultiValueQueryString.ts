import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const useMultiValueQueryString = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return useCallback(
    (key: string, values: string[]) => {
      const params = new URLSearchParams(searchParams.toString());

      params.delete(key);

      for (let i = 0; i < values.length; i++) {
        if (values[i]) {
          params.append(key, values[i]);
        }
      }

      return `${pathname}?${params.toString()}`;
    },
    [searchParams, pathname],
  );
};
