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
  loginByPasswordAction: (
    phone: string,
    password: string,
  ) => Promise<ResponseData<{ token: string; refresh: string }>>;
  canSendSms: boolean;
  codeLength: number;
  resendSecond: number;
};

const initCode = ["", "", "", "", "", ""];

export const SigninForm = (props: Props) => {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [phone, setPhone] = useState("");
  const [validPhone, setValidPhone] = useState<boolean>(false);
  const [code, setCode] = useState<string[]>(initCode);
  const [validCode, setValidCode] = useState<boolean>(false);
  const [password, setPassword] = useState("");
  const [isLoading, transition] = useTransition();
  const [error, setError] = useState("");
  const [resendSeconds, setResendSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const canSendSms = props.canSendSms === true;

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleChangePhone = (value: string) => {
    const validation = phoneSchema.safeParse(value);

    if (validation.success !== validPhone) {
      setValidPhone(validation.success);
    }

    setPhone(value);
    setPassword("");
    setCode(initCode);
    setValidCode(false);
    setResendSeconds(0);
    clearTimer();
    if (step !== 1) {
      setStep(1);
    }

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
    clearTimer();
    timerRef.current = setInterval(() => {
      setResendSeconds((seconds) => {
        if (seconds <= 1) {
          clearTimer();
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);
  };

  const getValidatedPhone = () => {
    const validationPhone = phoneSchema.safeParse(phone);
    if (!validationPhone.success) {
      const errorMessage =
        Array.isArray(validationPhone.error.issues) &&
        typeof validationPhone.error.issues[0]?.message === "string"
          ? validationPhone.error.issues[0]?.message
          : "Некорректный номер";
      setError(errorMessage);
      setValidPhone(false);
      return null;
    }
    return validationPhone.data;
  };

  const fetchSendPhone = (validatedPhone: string) => {
    transition(() => {
      return props
        .sendPhoneAction(validatedPhone)
        .then((response) => {
          if (response.status === "success" && response.data) {
            if (response.data?.device_id) {
              setDeviceId(response.data.device_id);
            }

            setError("");
            setCode(initCode);
            setValidCode(false);
            setStep(2);
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

  const fetchSendCode = (validatedPhone: string, smsCode: string) => {
    transition(() => {
      return props
        .sendCodeAction(validatedPhone, smsCode)
        .then((response) => {
          if (response.status === "success" && response.data?.token && response.data?.refresh) {
            setStep(1);
            setCode(initCode);
            setPassword("");
            setValidCode(false);
            setResendSeconds(0);
            clearTimer();
            setError("");
            router.back();
          } else {
            throw response.message || "Не удалось войти";
          }
        })
        .catch((error) => {
          const errorMessage = getMessageError(error, "Не удалось войти");
          setError(errorMessage);
        });
    });
  };

  const fetchLoginByPassword = (validatedPhone: string) => {
    if (!password) {
      setError("Введите пароль");
      return;
    }

    transition(() => {
      return props
        .loginByPasswordAction(validatedPhone, password)
        .then((response) => {
          if (response.status === "success" && response.data?.token && response.data?.refresh) {
            setStep(1);
            setCode(initCode);
            setPassword("");
            setValidCode(false);
            setResendSeconds(0);
            clearTimer();
            setError("");
            router.back();
          } else {
            setError(response.message || "Не удалось войти");
          }
        })
        .catch((error) => {
          const errorMessage = getMessageError(error, "Не удалось войти");
          setError(errorMessage);
        });
    });
  };

  const handleGetCode = () => {
    const validatedPhone = getValidatedPhone();
    if (!validatedPhone || !canSendSms) return;
    fetchSendPhone(validatedPhone);
  };

  const handleGoToPassword = () => {
    const validatedPhone = getValidatedPhone();
    if (!validatedPhone) return;
    setError("");
    setPassword("");
    setStep(3);
  };

  const handleSignIn: SubmitEventHandler = async (e) => {
    e.preventDefault();
    const validatedPhone = getValidatedPhone();
    if (!validatedPhone) return;

    if (step === 2) {
      const validationCode = loginCodeSchema.safeParse(code.join("").replace(/\D/g, ""));

      if (validationCode.success) {
        fetchSendCode(validatedPhone, validationCode.data);
      } else {
        const errorMessage =
          Array.isArray(validationCode.error.issues) &&
          typeof validationCode.error.issues[0]?.message === "string"
            ? validationCode.error.issues[0]?.message
            : "Некорректный код";
        setError(errorMessage);
        setValidCode(false);
      }
      return;
    }

    if (step === 3) {
      fetchLoginByPassword(validatedPhone);
    }
  };

  const handleBackToPhone = () => {
    setStep(1);
    setError("");
    setCode(initCode);
    setPassword("");
    setValidCode(false);
    setResendSeconds(0);
    clearTimer();
  };

  const handleResendCode = () => {
    const validatedPhone = getValidatedPhone();
    if (!validatedPhone || !canSendSms) return;

    setValidCode(false);
    setCode(initCode);
    setError("");
    setResendSeconds(0);
    clearTimer();
    fetchSendPhone(validatedPhone);
  };

  const submitDisabled =
    isLoading || (step === 2 && !validCode) || (step === 3 && password.length < 6);

  const title = step === 3 ? "Вход по паролю" : "Вход по номеру телефона";
  const subtitle =
    step === 1
      ? canSendSms
        ? "Введите номер телефона, чтобы получить код или войти по паролю"
        : "Сервис SMS временно недоступен. Вход по коду сейчас невозможен"
      : step === 2
        ? phone
          ? `Код отправлен на ${getPhoneDisplay(phone)}`
          : ""
        : phone
          ? `Номер: ${getPhoneDisplay(phone)}`
          : "";

  return (
    <form className={styles.loginForm} onSubmit={handleSignIn}>
      <header className={styles.headerContainer}>
        <h2>{title}</h2>
        <h4>{subtitle}</h4>
      </header>

      {step === 1 && (
        <div className={styles.inputWrapper}>
          <Input
            disabled={isLoading}
            onChange={(e) => handleChangePhone(e.target.value)}
            placeholder="7 949 123 45 67"
            variantSize="md"
            variant="outlined"
            autoFocus
            autoComplete="tel"
            maxLength={20}
            inputMode="tel"
            value={phone}
            name="user-phone"
            type="tel"
          />
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

      {step === 3 && (
        <div className={styles.inputWrapper}>
          <Input
            disabled={isLoading}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError("");
            }}
            placeholder="Пароль"
            label="Пароль"
            variantSize="md"
            variant="outlined"
            autoFocus
            autoComplete="current-password"
            value={password}
            name="user-password"
            type="password"
          />
        </div>
      )}

      {error && <span className={styles.errorText}>{error}</span>}

      <footer className={styles.footer}>
        {step === 1 && (
          <>
            <Button
              variant="solid"
              variantColor="violet"
              fullWidth
              type="button"
              disabled={isLoading || !validPhone}
              onClick={handleGoToPassword}
            >
              Войти по паролю
            </Button>
            <Button
              variant="outline"
              variantColor="violet"
              fullWidth
              type="button"
              disabled={isLoading || !validPhone || !canSendSms}
              onClick={handleGetCode}
            >
              Получить код
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            {resendSeconds <= 0 && (
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
            {validPhone && (
              <Button
                disabled={resendSeconds > 0 || !canSendSms}
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
            <Button
              variant="solid"
              variantColor="violet"
              fullWidth
              type="submit"
              disabled={submitDisabled}
            >
              Войти
            </Button>
          </>
        )}

        {step === 3 && (
          <>
            <Button
              fullWidth
              type="button"
              onClick={handleBackToPhone}
              disabled={isLoading}
              variantColor="gray"
            >
              Сменить номер
            </Button>
            {canSendSms && (
              <Button
                fullWidth
                type="button"
                onClick={handleGetCode}
                disabled={isLoading || !validPhone}
                variantColor="gray"
              >
                Получить код
              </Button>
            )}
            <Button
              variant="solid"
              variantColor="violet"
              fullWidth
              type="submit"
              disabled={submitDisabled}
            >
              Войти
            </Button>
          </>
        )}
      </footer>
    </form>
  );
};
