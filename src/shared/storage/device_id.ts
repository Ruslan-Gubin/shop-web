"use server";
import { cookies } from "next/headers";

export const setDeviceId = async (value: string) => {
  const cookiesStore = await cookies();
  cookiesStore.set("DEVICE_ID", value);
};
