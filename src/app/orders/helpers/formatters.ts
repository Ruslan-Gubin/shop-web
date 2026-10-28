import { formatDateRu } from "@/shared/helpers/formatters";

export const formatOrderDate = (date: string | Date | null | undefined): string =>
  date
    ? formatDateRu(date, {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

export const formatDeliveryDate = (date: string | Date | null | undefined): string => {
  if (!date) return "";

  const dateObj = new Date(date);
  const isCurrentYear = dateObj.getFullYear() === new Date().getFullYear();

  const formattedDate = new Intl.DateTimeFormat("ru", {
    day: "2-digit",
    month: "short",
    ...(isCurrentYear ? {} : { year: "2-digit" }),
  }).format(dateObj);

  return isCurrentYear ? formattedDate : `${formattedDate}г.`;
};

export const formatDeliveryTime = (date: string | Date | null | undefined): string => {
  if (!date) return "";

  return `${new Date(date).getHours()}:00`;
};

export const formatDeliveryInterval = (
  from: string | Date | null | undefined,
  to: string | Date | null | undefined,
): string => {
  if (!from) return "";

  return `${formatDeliveryDate(from)} с ${formatDeliveryTime(from)}${
    to ? ` до ${formatDeliveryTime(to)}` : ""
  }`;
};

export const formatDeliveryIntervalHours = (
  from: string | Date | null | undefined,
  to: string | Date | null | undefined,
): string => {
  if (!from) return "";

  return `с ${formatDeliveryTime(from)}${to ? ` до ${formatDeliveryTime(to)}` : ""}`;
};
