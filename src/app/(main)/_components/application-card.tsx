import Link from "next/link";

import { IconType } from "react-icons";
import { LucideIcon } from "lucide-react";
import { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

import { appVariants } from "@/constants";

interface Props extends VariantProps<typeof appVariants> {
  href: string;
  appIcon: IconType | LucideIcon;
  title: string;
  description: string;
}

export const ApplicationCard = ({ 
  href,
  appIcon: Icon,
  title,
  description 
}: Props) => {
  return (
    <article className="relative w-full flex group cursor-pointer">
      <Link href={href} className="flex select-none transition relative rounded flex-col overflow-hidden w-full h-auto flex-1 z-2 dark:bg-[#ffffff0d]">
        <div className="relative transition">
          <div className={cn("bg-accent block h-16")} />
          <div className="absolute top-11 left-6">
            <div className="size-9 flex items-center justify-center">
              <Icon className={cn("size-full text-tertiary")} />
            </div>
          </div>
        </div>
        <div className="p-4 relative">
          <div className="flex flex-col gap-0.5 h-full">
            <div className="pt-4 flex items-center gap-1.5">
              <h4 className="text-primary text-sm font-medium leading-5">
                {title}
              </h4>
            </div>
            <div className="flex flex-col gap-3 pt-2.5">
              <div className="max-h-12 h-12">
                <p className="text-foreground leading-4 font-normal text-xs">
                  {description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Link>
      <div className="absolute rounded inset-0 z-1 shadow-[0_12px_32px_0_rgba(0,0,0,0.02),0_0_0_1px_rgba(0,0,0,0.05)] group-hover:shadow-[0_12px_32px_0_rgba(0,0,0,0.02),0_0_0_1px_rgba(0,0,0,0.089)] dark:shadow-[unset] group-hover:dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]" />
    </article>
  );
}