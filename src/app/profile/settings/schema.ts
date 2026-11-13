import { z } from "zod";

export const changeUserNameEmailSchema = z.object({
  name: z
    .string({ message: "Введите имя" })
    .max(50, { message: "Максимум 50 символов" })
    .min(3, { message: "Имя должно содержать минимум 3 символа" })
    .or(z.literal("")),
  email: z
    .string({ message: "Введите почту" })
    .email({ message: "Некорректный формат почты" })
    .or(z.literal("")),
});

export const changePasswordSchema = z
  .object({
    password: z
      .string({
        message: "Введите пароль",
      })
      .nonempty()
      .min(6, { message: "Пароль должен быть не менее 6 символов" })
      .max(50, { message: "Пароль не должен превышать 50 символов" }),
    repeatPassword: z
      .string({
        message: "Введите пароль еще раз",
      })
      .nonempty()
      .min(6, { message: "Пароль должен быть не менее 6 символов" })
      .max(30, { message: "Пароль не должен превышать 30 символов" }),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Пароли не совпадают",
    path: ["repeatPassword"],
  });
