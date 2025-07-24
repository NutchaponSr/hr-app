"use client";

import { 
  ContrastIcon, 
  LogOutIcon, 
  SettingsIcon 
} from "lucide-react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { Loader } from "@/components/loader";

import { UserAvatar } from "@/modules/auth/ui/components/user-avatar";

export const UserButton = () => {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  if (isPending || !session) {
    return <Loader />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <UserAvatar name={session.user.name} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" alignOffset={12} className="w-48">
        <DropdownMenuLabel className="overflow-hidden">
          <h5 className="text-primary text-xs font-medium whitespace-nowrap text-ellipsis overflow-hidden">
            {session.user.name}
          </h5>
          <p className="text-xs text-tertiary font-normal whitespace-nowrap text-ellipsis overflow-hidden">
            {session.user.email}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <SettingsIcon className="stroke-[0.3]" />
          การตั้งค่า
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ContrastIcon className="stroke-[0.3]" />
          ธีม
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/auth/sign-in")
            }
          }
        })}>
          <LogOutIcon className="stroke-[0.3]" />
          ออกจากระบบ
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}