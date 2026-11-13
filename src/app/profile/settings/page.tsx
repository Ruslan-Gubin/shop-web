import { NotContent } from "@/shared/ui/not-content/NotContent";
import { ErrorList } from "@/views/error-list/ErrorList";
import { UpdateToken } from "@/views/UpdateToken/UpdateToken";
import { fetchUserSettings } from "../action";
import { changeUserAvatarAction, changeUserDataAction, changeUserPasswordAction } from "./action";
import { AvatarField } from "./components/AvatarField/AvatarField";
import { PasswordForm } from "./components/PasswordForm/PasswordForm";
import { SettingsForm } from "./components/SettingsForm/SettingsForm";
import styles from "./Settings.module.css";

export default async function ProfileSettingsPage() {
  const userData = await fetchUserSettings();
  const user = userData.data;

  return (
    <section className={styles.root}>
      {userData.tokens && <UpdateToken tokens={userData.tokens} />}
      <ErrorList errorsList={[userData]} />

      {user ? (
        <>
          <div className={styles.card}>
            <AvatarField avatarUrl="" changeUserAvatarAction={changeUserAvatarAction} />
          </div>

          <div className={styles.card}>
            <SettingsForm
              name={user.name ?? ""}
              email={user.email ?? ""}
              changeUserDataAction={changeUserDataAction}
            />
          </div>

          <div className={styles.card}>
            <PasswordForm
              hasPassword={user.has_password}
              changeUserPasswordAction={changeUserPasswordAction}
            />
          </div>
        </>
      ) : (
        <NotContent
          title="Войдите, чтобы продолжить"
          subTitle="Заказы, избранное, лист ожидания и отзывы — всё в одном аккаунте. Введите номер телефона — на него придёт код подтверждения, и вы войдёте в систему."
          href="/sign-in"
          buttonText="Войти"
        />
      )}
    </section>
  );
}
