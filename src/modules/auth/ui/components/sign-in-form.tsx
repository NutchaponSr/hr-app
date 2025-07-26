"use client";

import Link from "next/link";
import toast from "react-hot-toast";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useLanguage } from "@/hooks/use-language";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { signIn } from "@/modules/auth/actions/sign-in";

export const SignInForm = () => {
  const { t } = useLanguage();

  const router = useRouter();

  const [password, setPassword] = useState("");
  const [emailOrUsername, setEmailOrUsername] = useState("");

  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setIsPending(true);

    const { error } = await signIn(emailOrUsername, password);

    if (error) {
      setError(error);
    } else {
      toast.success(t("auth.sign-in.form.toast.success"));

      router.push("/");
    }

    setIsPending(false);
  }

  return (
    <>
      <form onSubmit={onSubmit} className="text-left flex flex-col gap-4 w-full">
        <Label className="flex flex-col items-start">
          <div>{t("auth.sign-in.form.email.label")}</div>
          <Input
            required
            value={emailOrUsername}
            disabled={isPending}
            placeholder={t("auth.sign-in.form.email.placeholder")}
            onChange={(e) => setEmailOrUsername(e.target.value)}
          />
          <p className="text-xs text-tertiary font-normal">
            {t("auth.sign-in.form.email.message")}
          </p>
        </Label>
        <Label className="flex flex-col items-start">
          <div>{t("auth.sign-in.form.password.label")}</div>
          <Input
            required
            disabled={isPending}
            value={password}
            type="password"
            placeholder={t("auth.sign-in.form.password.placeholder")}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Link href="/auth/forget-password" className="text-xs underline hover:text-danger text-tertiary font-normal">
            {t("auth.sign-in.form.password.message")}
          </Link>
        </Label>
        <Button size="lg" disabled={isPending}>
          {t("auth.sign-in.form.submit")}
        </Button>
      </form>
      <div data-error={!!error} className="data-[error=true]:block hidden mt-3 text-destructive text-center w-full text-sm transition-all">
        {error}
      </div>
    </>
  );
}