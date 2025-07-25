"use client";

import toast from "react-hot-toast";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { signIn } from "@/modules/auth/actions/sign-in";

export const SignInForm = () => {
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
      toast.success("Login successfully");

      router.push("/");
    }

    setIsPending(false);
  }

  return (
    <>
      <form onSubmit={onSubmit} className="text-left flex flex-col gap-4 w-full">
        <Label className="flex flex-col items-start">
          <div>Email / Employee Id</div>
          <Input 
            required
            value={emailOrUsername}
            disabled={isPending}
            onChange={(e) => setEmailOrUsername(e.target.value)}
          />
          <p className="text-xs text-tertiary font-normal">
            Use an organization email to easily collaborate with teammates
          </p>
        </Label>
        <Label className="flex flex-col items-start">
          <div>Password</div>
          <Input 
            required
            disabled={isPending}
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <a href="/auth/forget-password" className="text-xs underline hover:text-danger text-tertiary font-normal">
            Forget your password?
          </a>
        </Label>
        <Button size="lg" disabled={isPending}>
          Continue
        </Button>
      </form>
      <div data-error={!!error} className="data-[error=true]:block hidden mt-3 text-destructive text-center w-full text-sm transition-all">
        {error}
      </div>
    </>
  );
}