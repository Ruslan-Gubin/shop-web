"use client";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { debounce } from "@/shared/helpers/debounce";

type UseHorizontalScrollOptions = {
  scrollDistance?: number | ((containerWidth: number) => number);
  debounceMs?: number;
};

type UseHorizontalScrollReturn = {
  ref: React.RefObject<HTMLUListElement | null>;
  activeArrows: boolean;
  leftActive: boolean;
  rightActive: boolean;
  handleScroll: (direction: "left" | "right") => void;
};

export const useHorizontalScroll = (
  options: UseHorizontalScrollOptions = {},
): UseHorizontalScrollReturn => {
  const { debounceMs = 200 } = options;
  const [leftActive, setLeftActive] = useState(false);
  const [rightActive, setRightActive] = useState(true);
  const [activeArrows, setActiveArrows] = useState(false);

  const ref = useRef<HTMLUListElement | null>(null);

  const scrollListener = useEffectEvent(() => {
    if (!ref.current) return;
    const node = ref.current;

    const currentScroll = node.scrollLeft;
    const clientWidth = node.clientWidth;
    const scrollWidth = node.scrollWidth;
    const isAtStart = currentScroll <= 0;
    const isAtEnd = currentScroll + clientWidth >= scrollWidth - 20;

    setLeftActive(!isAtStart);
    setRightActive(!isAtEnd);
  });

  const resizeListener = useEffectEvent(() => {
    if (!ref.current) return;
    const node = ref.current;

    const hasOverflow = node.scrollWidth > node.clientWidth;
    setActiveArrows(hasOverflow);
  });

  useEffect(() => {
    if (!ref.current) return;
    const node = ref.current;

    const onScroll = debounce(scrollListener, debounceMs);
    const onResize = debounce(resizeListener, debounceMs);

    node.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);

    onResize();
    onScroll();

    return () => {
      node.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [debounceMs]);

  const handleScroll = (direction: "left" | "right") => {
    const el = ref.current;
    if (!el) return;

    const containerWidth = el.clientWidth;
    const scrollLeft = el.scrollLeft;

    const distance =
      typeof options.scrollDistance === "function"
        ? options.scrollDistance(containerWidth)
        : (options.scrollDistance ?? containerWidth);

    const left = direction === "left" ? scrollLeft - distance : scrollLeft + distance;
    el.scrollTo({ behavior: "smooth", left });
  };

  return { ref, activeArrows, leftActive, rightActive, handleScroll };
};
