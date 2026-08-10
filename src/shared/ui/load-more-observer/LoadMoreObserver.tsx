"use client";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { getUpdateQueryPageString } from "@/shared/helpers/getUpdateQueryPageString";
import { useIntersectionObserver } from "@/shared/hooks/useIntersectionObserver";

type Props = {
  disabled: boolean;
  patch: string;
  searchParams: { [key: string]: string | string[] | undefined };
  currentPage: number;
  isValidDataFromPage: boolean;
};

export const LoadMoreObserver = (props: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const onIntersect = () => {
    const routerUrl = getUpdateQueryPageString(
      props.patch,
      props.searchParams,
      props.currentPage + 1,
    );
    router.push(routerUrl, { scroll: false, transitionTypes: ["LoadMore"] });
  };

  useIntersectionObserver({
    target: ref,
    onIntersect: onIntersect,
    threshold: 1,
    disabled: props.disabled,
  });

  return <div ref={ref} style={{ height: "10px" }}></div>;
};
