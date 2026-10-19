"use server";
import { sendCodeAction, sendPhoneAction } from "./action";
import styles from "./Login.module.css";
import { SigninForm } from "./signin-form/SigninForm";

export default async function SigninPage() {
  return (
    <section className={styles.loginWrapper}>
      <SigninForm
        codeLength={6}
        resendSecond={60}
        sendCodeAction={sendCodeAction}
        sendPhoneAction={sendPhoneAction}
      />
    </section>
  );
}
