"use server";
import { ErrorList } from "@/views/error-list/ErrorList";
import { canSendSmsAction, sendCodeAction, sendPhoneAction } from "./action";
import styles from "./Login.module.css";
import { SigninForm } from "./signin-form/SigninForm";

export default async function SigninPage() {
  const canSendSms = await canSendSmsAction();

  return (
    <section className={styles.loginWrapper}>
      <ErrorList errorsList={[canSendSms]} />
      <SigninForm
        codeLength={6}
        resendSecond={60}
        sendCodeAction={sendCodeAction}
        sendPhoneAction={sendPhoneAction}
      />
    </section>
  );
}
