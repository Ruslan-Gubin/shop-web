import { z } from "zod";

const textOptional = () =>
  z.string().refine((val) => val.length === 0 || (val.length >= 10 && val.length <= 1000), {
    message: "Число символов от 10 до 1000",
  });

export const createReviewSchema = z.object({
  rating: z
    .number({ message: "Поставьте оценку" })
    .min(1, { message: "Поставьте оценку" })
    .max(5, { message: "Оценка от 1 до 5" }),
  dignities: textOptional(),
  disadvantages: textOptional(),
  comment: textOptional(),
});
