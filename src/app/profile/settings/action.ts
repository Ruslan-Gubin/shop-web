"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { fetchService } from "@/shared/fetch-api";
import { updateTokensInAction } from "@/shared/helpers/updateCookieAction";
import { getValidatePayload } from "@/shared/services/get-form-action-state";
import { setErrorFromServer } from "@/shared/services/set-new-store-error-from-server";
import { changePasswordSchema, changeUserNameEmailSchema } from "./schema";

export type ChangeUserDataPayload = {
  name: string;
  email: string;
};

export type ChangeUserDataResponse = {
  status: "error" | "success";
  errors: Record<keyof ChangeUserDataPayload, string>;
  data: null;
  message: string;
};

export type ChangeUserPasswordPayload = {
  password: string;
  repeatPassword: string;
};

export type ChangeUserPasswordResponse = {
  status: "error" | "success";
  errors: Record<keyof ChangeUserPasswordPayload, string>;
  data: null;
  message: string;
};

export const changeUserDataAction = async (
  payload: ChangeUserDataPayload,
): Promise<ChangeUserDataResponse> => {
  const { isValid, errors } = getValidatePayload(payload, changeUserNameEmailSchema);

  if (isValid) {
    const cookieStore = await cookies();

    return await fetchService
      .patch<null>({
        url: "users/update-profile",
        payload,
      })
      .then((response) => {
        if (response.tokens) {
          updateTokensInAction(cookieStore, response.tokens);
        }

        if (response.status === "error" && response.errors) {
          setErrorFromServer(response.errors, errors);
        }

        return { status: response.status, errors, data: response.data, message: response.message };
      });
  }

  return { status: "error", errors, data: null, message: "" };
};

export const changeUserPasswordAction = async (
  payload: ChangeUserPasswordPayload,
): Promise<ChangeUserPasswordResponse> => {
  const { isValid, errors } = getValidatePayload(payload, changePasswordSchema);

  if (isValid) {
    const cookieStore = await cookies();

    return await fetchService
      .patch<null>({
        url: "users/update-password",
        payload: { password: payload.password },
      })
      .then((response) => {
        if (response.tokens) {
          updateTokensInAction(cookieStore, response.tokens);
        }

        if (response.status === "error" && response.errors) {
          setErrorFromServer(response.errors, errors);
        }

        return { status: response.status, errors, data: response.data, message: response.message };
      });
  }

  return { status: "error", errors, data: null, message: "" };
};

export const uploadAvatarAction = async (formData: FormData) => {
  const cookieStore = await cookies();

  return fetchService
    .patch<null>({
      url: "users/avatar",
      payload: formData as unknown as Record<string, unknown>,
    })
    .then((response) => {
      if (response.tokens) {
        updateTokensInAction(cookieStore, response.tokens);
      }

      if (response.status === "success") {
        revalidatePath("/profile/settings");
        revalidatePath("/profile");
      }

      return response;
    });
};

export const deleteAvatarAction = async () => {
  const cookieStore = await cookies();

  return fetchService
    .delete<null>({
      url: "users/avatar",
    })
    .then((response) => {
      if (response.tokens) {
        updateTokensInAction(cookieStore, response.tokens);
      }

      if (response.status === "success") {
        revalidatePath("/profile/settings");
        revalidatePath("/profile");
      }

      return response;
    });
};
