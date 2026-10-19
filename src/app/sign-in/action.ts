"use server";
import { cookies } from "next/headers";
import { CONFIG_APP } from "@/shared/config/config";
import { fetchService } from "@/shared/fetch-api";
import { updateTokensInAction } from "@/shared/helpers/updateCookieAction";

export const sendPhoneAction = async (phone: string) => {
  const cookieStore = await cookies();
  const device = cookieStore.get("DEVICE_ID");

  return fetchService
    .post<{ device_id: string; phone: string }>({
      url: "sms/request-otp",
      payload: { phone, device_id: device?.value || null, hash_code: "" },
    })
    .then((response) => {
      if (response.tokens) {
        updateTokensInAction(cookieStore, response.tokens);
      }
      return response;
    });
};

export const sendCodeAction = async (phone: string, code: string) => {
  const cookieStore = await cookies();

  return fetchService
    .post<{ token: string; refresh: string }>({
      url: "auth/verify-otp",
      payload: { phone, code },
    })
    .then((response) => {
      if (
        response.status === "success" &&
        response.data &&
        response.data.refresh &&
        response.data.token
      ) {
        cookieStore.set(CONFIG_APP.ACCESS_TOKEN_COOKIE, response.data.token);
        cookieStore.set(CONFIG_APP.REFRESH_TOKEN_COOKIE, response.data.refresh);
      }
      return response;
    });
};
