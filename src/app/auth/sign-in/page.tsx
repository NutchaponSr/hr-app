import { AuthCard } from "@/modules/auth/ui/components/auth-card";
import { SignInForm } from "@/modules/auth/ui/components/sign-in-form";

const Page = () => {
  return (
    <AuthCard title="Sign in to your account">
      <SignInForm />
    </AuthCard>
  );
}

export default Page

