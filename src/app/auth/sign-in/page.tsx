import { Suspense } from "react";
import { AuthCard } from "@/modules/auth/ui/components/auth-card";
import { SignInForm } from "@/modules/auth/ui/components/sign-in-form";

const SignInFormWrapper = () => {
  return (
    <AuthCard title="Sign in to your account">
      <SignInForm />
    </AuthCard>
  );
};

const Page = () => {
  return (
    <Suspense fallback={
      <AuthCard title="Sign in to your account">
        <div className="flex items-center justify-center p-8">
          <div className="text-sm text-muted-foreground">Loading...</div>
        </div>
      </AuthCard>
    }>
      <SignInFormWrapper />
    </Suspense>
  );
}

export default Page

