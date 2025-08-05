"use client";

import Link from "next/link";
import Image from "next/image";

import { MenuIcon } from "lucide-react";

import { useScrollTop } from "@/hooks/use-scroll-top";

import { Button } from "@/components/ui/button";

import { UserButton } from "@/modules/auth/ui/components/user-button";
import { usePermission } from "@/modules/auth/hooks/use-permission";

export const Header = () => {
  const scrolling = useScrollTop();

  const { data: permission, isLoading } = usePermission();

  if (!permission || isLoading) return null;

  return (
    <header className="fixed top-0 z-50 w-full bg-background backdrop-blur-xl">
      <div className="flex flex-row md:h-18 h-12 items-center justify-between px-6 mx-auto max-w-[1392px]">
        <nav className="hidden md:flex items-center gap-x-1.5">
          <Link href="/" className="flex items-center justify-center shrink-0 mr-4">
            <Image 
              src="/logo.svg"
              alt="Logo"
              width={48}
              height={48}
            />
          </Link>
          {permission.data!.success && (
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard">
                Dashboard
              </Link>
            </Button>
          )}
        </nav>

        <div className="hidden md:flex items-center">
          <div className="flex flex-row gap-2.5">
            <UserButton />
          </div>
        </div>
        <Button 
          size="icon"
          variant="ghost"
          className="flex md:hidden"
        >
          <MenuIcon />
        </Button>
      </div>

      <div data-scroll={scrolling} className="data-[scroll=true]:flex hidden flex-row items-center justify-between px-6 mx-auto max-w-[1392px]">
        <div className="shrink-0 w-full h-[1.25px] bg-border" />
      </div>
    </header>
  );
}