export const getPhoneDisplay = (phone: string) => {
  const digits = phone.replace(/\D/g, "");

  return `${digits.at(0) === "7" || digits.at(0) === "8" ? "+" : ""}${digits[0]} ${digits.slice(1, 4)} ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`;
};
