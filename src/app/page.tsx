import Link from "next/link";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import { Button } from "@/components/ui/button";

import { SignOutButton } from "@/modules/auth/ui/components/sign-out-button";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const FULL_ACCESS = await auth.api.userHasPermission({
    headers: await headers(),
    body: {
      userId: session.user.id,
      permission: {
        backend: ["access"],
      },
    },
  })

  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-2">
      <div className="flex items-center gap-3">
        <SignOutButton />
        {FULL_ACCESS.success && (
          <Button asChild variant="outline">
            <Link href="/dashboard">
              Dashboard
            </Link>
          </Button>
        )}
      </div>
      <pre className="text-xs text-primary bg-accent border-[1.5px] border-border p-4 rounded-sm">
        {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  );  
}

export default Page;