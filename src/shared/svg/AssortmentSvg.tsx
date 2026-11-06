import type { ReactNode } from "react";

export type AssortmentIconName =
  | "toys"
  | "stationery"
  | "household"
  | "dishes"
  | "electronics"
  | "garden"
  | "holiday";

const icons: Record<AssortmentIconName, ReactNode> = {
  toys: (
    <>
      <path d="M12 3.5 4.5 20.5h15L12 3.5Z" />
      <path d="M8.7 12.5h6.6M6.6 17h10.8" />
    </>
  ),
  stationery: (
    <>
      <path d="m4 20 1.3-4.3L16.6 4.4a2.1 2.1 0 0 1 3 3L8.3 18.7 4 20Z" />
      <path d="m14.6 6.4 3 3" />
    </>
  ),
  household: (
    <>
      <path d="M5 9h14l-1.4 9.6a2 2 0 0 1-2 1.7H8.4a2 2 0 0 1-2-1.7L5 9Z" />
      <path d="M8.5 9a3.5 3.5 0 0 1 7 0" />
    </>
  ),
  dishes: (
    <>
      <path d="M5 8h10v7a5 5 0 0 1-10 0V8Z" />
      <path d="M15 10h1.5a2.5 2.5 0 0 1 0 5H15" />
    </>
  ),
  electronics: <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />,
  garden: (
    <>
      <path d="M20 4C11 4 4 8.5 4 15.5 4 18 5.8 20 8.5 20 15.5 20 20 13 20 4Z" />
      <path d="M5.5 19.5C8 14 12.5 10 17 7.5" />
    </>
  ),
  holiday: (
    <>
      <circle cx="12" cy="8.5" r="5.5" />
      <path d="M12 14v2.5" />
      <path d="M10.5 20.5c1-1.3 2-1.3 3 0" />
    </>
  ),
};

type Props = {
  name: AssortmentIconName;
};

export const AssortmentSvg = ({ name }: Props) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
};
