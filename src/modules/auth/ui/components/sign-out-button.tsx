"use client";

import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";

export const SignOutButton = () => {
  const router = useRouter();

  return (
    <Button onClick={() => authClient.signOut({ fetchOptions: { onSuccess: () => { router.refresh() } } })} variant="destructive">
      Sign out
    </Button>
  );
}