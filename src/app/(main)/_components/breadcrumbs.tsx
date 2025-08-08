"use client";

import React from "react";
import Link from "next/link";

import { usePathname } from "next/navigation";

import { ChevronRightIcon } from "lucide-react";

export const Breadcrumbs = () => {
  const pathname = usePathname();

  const paths: string[] = pathname.split("/").filter(Boolean);

  if (pathname === "/") return null;

  return (
    <div className="flex items-center mb-2 gap-2 select-none">
      <Link href="/" className="text-[#0006] text-xs hover:text-danger transition">
        Apps
      </Link>
      <ChevronRightIcon className="size-3" />
      {paths.map((path, index) => {
        const href = "/" + paths.slice(0, index + 1).join("/");
        return (
          <React.Fragment key={index}>
            <Link href={href} className="first-letter:uppercase text-primary text-xs">
              {path}
            </Link>
            {index < paths.length - 1 && <ChevronRightIcon className="size-3" />}
          </React.Fragment>
        );
      })}
    </div>
  );
}