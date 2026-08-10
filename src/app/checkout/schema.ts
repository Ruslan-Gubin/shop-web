import { z } from "zod";

export const createAddressSchema = z.object({
  type: z.enum(["pickup", "courier"], {
    errorMap: () => ({ message: "Тип адреса должен быть самовывозом или доставкой" }),
  }),
  name: z.string(),
  place: z.string(),
  lng: z.number({ invalid_type_error: "Долгота должна быть числом" }),
  lat: z.number({ invalid_type_error: "Широта должна быть числом" }),
  entrance: z.string().or(z.literal("")),
  flat: z.string().or(z.literal("")),
  floor: z.string().or(z.literal("")),
  intercom: z.string().or(z.literal("")),
});

export const createOrderProductSchema = z.object({
  product_id: z.number({ invalid_type_error: "ID заказа должен быть числом" }),
  quantity: z
    .number({ invalid_type_error: "Количество должен быть числом" })
    .min(1, { message: "Количество должно быть минимум 1" }),
});

export const createOrderSchema = z.object({
  phone: z
    .string()
    .min(10, {
      message: "Телефон получателя должен состоять минимум из 10 символов",
    })
    .regex(/^(\+?\d{1,3})?[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}|\d{10,15}$/, {
      message: "Некорректный формат номера телефона",
    })
    .or(z.literal("")),
  phoneCode: z.string().or(z.literal("")),
  recipient_name: z
    .string()
    .max(50, { message: "Максимум 50 символов" })
    .min(3, { message: "Имя получателя должно содержать минимум 3 символа" })
    .or(z.literal("")),
  comment: z
    .string()
    .max(1000, { message: "Комментарий должен содержать максимум 1000 символов" })
    .or(z.literal("")),
  payment_method: z.enum(["cash", "card"], {
    message: "Способ оплаты должен быть или наличными или банковской картой",
  }),
  method_receipt: z.enum(["pickup", "courier"], {
    message: "Способ получения должен быть самовывозом или доставкой",
  }),
  date_from: z.date({
    message: "Дата доставки от должна быть корректной датой",
  }),
  date_to: z.date({ message: "Дата доставки до должна быть корректной датой" }),
  address: createAddressSchema,
  products: z.array(createOrderProductSchema),
});
