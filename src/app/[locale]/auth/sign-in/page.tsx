import { getDictionary } from "@/lib/dictionaries";

import { AuthCard } from "@/modules/auth/ui/components/auth-card";
import { SignInForm } from "@/modules/auth/ui/components/sign-in-form";

interface Props {
  params: Promise<{ locale: string }>;
}

const Page = async ({ params }: Props) => {
  const { locale } = await params;

  const dictionary = await getDictionary(locale as "en" | "th");

  return (
    <AuthCard t={dictionary} title={dictionary.auth["sign-in"].title}>
      <SignInForm />
    </AuthCard>
  );
}

export default Page

