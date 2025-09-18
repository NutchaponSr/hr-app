"use client";

import { authClient } from "@/lib/auth-client";

import { AuthLayout } from "../layouts/auth-layout";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const auth = authClient.useSession();

  if (auth.isPending) {
    return (
      <AuthLayout>
        Loading...
      </AuthLayout>
    );
  }

  if (!auth.data) {
    return (
      <AuthLayout>
        You must be logged in.
      </AuthLayout>
    );
  }

  return <>{children}</>;
};
