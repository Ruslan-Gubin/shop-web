"use client";
import { useRouter } from "next/navigation";
import { type SubmitEventHandler, useEffect, useRef, useState, useTransition } from "react";
import { getPhoneDisplay } from "@/shared/helpers/getFormattedPhone";
import { getMessageError } from "@/shared/helpers/getMessageError";
import { setDeviceId } from "@/shared/storage/device_id";
import type { ResponseData } from "@/shared/types/response";
import { Button } from "@/shared/ui/button-main/Button";
import { Input } from "@/shared/ui/input-main/Input";
import { OtpInput } from "@/shared/ui/otp-input/OtpInput";
import { loginCodeSchema, phoneSchema } from "../schema";
import styles from "./SigninForm.module.css";

type Props = {
  sendPhoneAction: (phone: string) => Promise<ResponseData<{ device_id: string; phone: string }>>;
  sendCodeAction: (
    phone: string,
    code: string,
  ) => Promise<ResponseData<{ token: string; refresh: string }>>;
  codeLength: number;
  resendSecond: number;
};

const initCode = ["", "", "", "", "", ""];

export const SigninForm = (props: Props) => {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [phone, setPhone] = useState(""); //7 949 386 57 86
  const [validPhone, setValidPhone] = useState<boolean>(false);
  const [code, setCode] = useState<string[]>(initCode);
  const [validCode, setValidCode] = useState<boolean>(false);
  const [isLoading, transition] = useTransition();
  const [error, setError] = useState("");
  const [resendSeconds, setResendSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleChangePhone = (value: string) => {
    const validation = phoneSchema.safeParse(value);

    if (validation.success !== validPhone) {
      setValidPhone(validation.success);
    }

    setPhone(value);

    if (error) {
      setError("");
    }
  };

  const handleChangeCode = (id: number, value: string) => {
    const updateCode = code.map((item, index) => (index === id ? value : item));
    const validation = loginCodeSchema.safeParse(updateCode.join("").replace(/\D/g, ""));

    if (validation.success && !validCode) {
      setValidCode(true);
    } else if (!validation.success && validCode) {
      setValidCode(false);
    }

    setCode(updateCode);
    setError("");
  };

  const startResendTimer = () => {
    setResendSeconds(props.resendSecond);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setResendSeconds((seconds) => {
        if (seconds <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);
  };

  const fetchSendPhone = (phone: string) => {
    transition(() => {
      return props
        .sendPhoneAction(phone)
        .then((response) => {
          if (response.status === "success" && response.data) {
            if (response.data?.device_id) {
              setDeviceId(response.data.device_id);
            }

            if (error) {
              setError("");
            }

            if (step !== 2) {
              setStep(2);
            }

            startResendTimer();
          } else {
            throw response.message;
          }
        })
        .catch((error) => {
          const errorMessage = getMessageError(error, "Не удалось выслать код на этот номер");
          setError(errorMessage);
        });
    });
  };

  const fetchSendCode = (phone: string, code: string) => {
    transition(() => {
      return props
        .sendCodeAction(phone, code)
        .then((response) => {
          if (response.status === "success") {
            setCode(initCode);
            setPhone("");

            if (timerRef.current) {
              clearInterval(timerRef.current);
            }

            setError("");
            router.back();
          } else {
            throw response.message;
          }
        })
        .catch((err) => {
          const errorMessage = getMessageError(err, "Не удалось войти");
          setError(errorMessage);
        });
    });
  };

  const handleSignIn: SubmitEventHandler = async (e) => {
    e.preventDefault();
    const validationPhone = phoneSchema.safeParse(phone);

    if (step === 1) {
      if (validationPhone.success) {
        fetchSendPhone(validationPhone.data);
      } else {
        const errorMessage =
          Array.isArray(validationPhone.error.issues) &&
          typeof validationPhone.error.issues[0]?.message === "string"
            ? validationPhone.error.issues[0]?.message
            : "Некорректный номер";
        setError(errorMessage);
        setValidPhone(false);
      }
    } else {
      const validationCode = loginCodeSchema.safeParse(code.join("").replace(/\D/g, ""));

      if (validationCode.success && validationPhone.success) {
        fetchSendCode(validationPhone.data, validationCode.data);
      } else if (!validationCode.success) {
        const errorMessage =
          Array.isArray(validationCode.error.issues) &&
          typeof validationCode.error.issues[0]?.message === "string"
            ? validationCode.error.issues[0]?.message
            : "Некорректный код";
        setError(errorMessage);
        setValidCode(false);
      }
    }
  };

  const handleBackToPhone = () => {
    setStep(1);
    setError("");
    setCode(initCode);
  };

  const handleResendCode = () => {
    const validation = phoneSchema.safeParse(phone);

    if (validation.success) {
      fetchSendPhone(validation.data);
      setValidCode(false);
      setCode(initCode);
      setError("");

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      startResendTimer();
    }
  };

  const disabled =
    isLoading || (step === 1 && (!validPhone || resendSeconds > 0)) || (step === 2 && !validCode);
  const submitText = step === 2 ? "Войти" : "Получить код";

  return (
    <form className={styles.loginForm} onSubmit={handleSignIn}>
      <header className={styles.headerContainer}>
        <h2>Вход по номеру телефона</h2>
        <h4>
          {step === 1
            ? "На него придёт SMS с кодом подтверждения"
            : phone
              ? `Код отправлен на ${getPhoneDisplay(phone)}`
              : ""}
        </h4>
      </header>

      {step === 1 && (
        <div className={styles.inputWrapper}>
          <div className={`${styles.inputContainer} ${error ? styles.inputContainerError : ""}`}>
            <Input
              disabled={isLoading}
              error={""}
              onChange={(e) => handleChangePhone(e.target.value)}
              placeholder="7 949 123 45 67"
              variantSize="md"
              variant="outlined"
              autoFocus
              autoComplete="off"
              maxLength={20}
              inputMode="tel"
              value={phone}
              name="user-phone"
              type="tel"
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className={styles.inputWrapper}>
          <OtpInput
            code={code}
            onChangeCodeAction={handleChangeCode}
            length={props.codeLength}
            disabled={isLoading}
            error={Boolean(error)}
          />
        </div>
      )}

      {error && <span className={styles.errorText}>{error}</span>}

      <footer className={styles.footer}>
        {step === 2 && resendSeconds <= 0 && (
          <Button
            fullWidth
            type="button"
            onClick={handleBackToPhone}
            disabled={isLoading}
            variantColor="gray"
          >
            Сменить номер
          </Button>
        )}
        {step === 2 && validPhone && (
          <Button
            disabled={resendSeconds > 0}
            fullWidth
            type="button"
            onClick={handleResendCode}
            variantColor="gray"
          >
            {resendSeconds > 0
              ? `Отправить код повторно через: ${String(resendSeconds).padStart(2, "0")}`
              : "Отправить код ещё раз"}
          </Button>
        )}
        <Button variant="solid" variantColor="violet" fullWidth type="submit" disabled={disabled}>
          {submitText}
        </Button>
      </footer>
    </form>
  );
};
