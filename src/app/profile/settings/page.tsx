import type { Metadata } from "next";
import { NotContent } from "@/shared/ui/not-content/NotContent";
import { ErrorList } from "@/views/error-list/ErrorList";
import { UpdateToken } from "@/views/UpdateToken/UpdateToken";
import { fetchUserSettings } from "../action";
import { changeUserAvatarAction, changeUserDataAction, changeUserPasswordAction } from "./action";
import { AvatarField } from "./components/AvatarField/AvatarField";
import { PasswordForm } from "./components/PasswordForm/PasswordForm";
import { SettingsForm } from "./components/SettingsForm/SettingsForm";

export const metadata: Metadata = {
  title: "Настройки пользователя",
  description: "Управление личными данными, аватаром и паролем в личном кабинете.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ProfileSettingsPage() {
  const userData = await fetchUserSettings();
  const user = userData.data;

  return (
    <section className="page-wrapper">
      {userData.tokens && <UpdateToken tokens={userData.tokens} />}
      <ErrorList errorsList={[userData]} />

      {user ? (
        <>
          <AvatarField avatarUrl="" changeUserAvatarAction={changeUserAvatarAction} />
          <SettingsForm
            name={user.name ?? ""}
            email={user.email ?? ""}
            changeUserDataAction={changeUserDataAction}
          />
          <PasswordForm
            hasPassword={user.has_password}
            changeUserPasswordAction={changeUserPasswordAction}
          />
        </>
      ) : (
        <NotContent
          title="Войдите в аккаунт"
          subTitle="Чтобы изменить настройки профиля, войдите в аккаунт. После входа вы сможете обновить личные данные, аватар и пароль."
          href="/sign-in"
          buttonText="Войти"
        />
      )}
    </section>
  );
}
