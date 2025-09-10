"use client";

import { IconType } from "react-icons";
import { MenuIcon } from "lucide-react";

import { useSidebar } from "@/hooks/use-sidebar";

import { Button } from "@/components/ui/button";

import { ModeToggle } from "@/components/toggle-mode";

import { Breadcrumbs } from "@/app/(main)/_components/breadcrumbs";

interface Props {
  paths: string[];
  children?: React.ReactNode;
  nameMap?: Record<string, string>;
  iconMap?: Record<string, IconType>;
  disabledPaths?: string[];
  disabledMap?: Record<string, boolean>;
  disableLastItem?: boolean;
}

export const Header = ({ children, ...props }: Props) => {
  const { isCollapsed, resetWidth } = useSidebar();

  return (
    <header className="max-w-screen z-100 bg-background">
      <div className="w-[calc(100%-0px)] max-w-screen h-11 relative">
        <div className="flex justify-between items-center overflow-hidden h-11 px-3">
          {isCollapsed && (
            <Button size="iconSm" variant="ghost" onClick={resetWidth}>
              <MenuIcon className="size-5 text-primary" />
            </Button>
          )}
          <Breadcrumbs {...props} />

          <div className="grow shrink" />
          <div className="grow-0 shrink-0 flex items-center ps-2.5 justify-between z-101 h-11">
            <div className="flex items-center gap-2">
              {children}
            </div>
          </div>

          <ModeToggle /> 
        </div>
      </div>
    </header>
  );
}