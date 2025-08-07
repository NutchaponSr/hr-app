"use client";

import React from "react";
import Link from "next/link";

import { usePathname } from "next/navigation";

import { ChevronRightIcon } from "lucide-react";

export const Breadcrumbs = () => {
  const pathname = usePathname();

  const paths: string[] = pathname.split("/");

  if (pathname === "/") return null;

  return (
    <div className="flex items-center mb-2 gap-2 select-none">
      <Link href="/" className="text-[#0006] text-xs hover:text-danger transition">
        Apps
      </Link>
      <ChevronRightIcon className="size-3" />
      {paths.splice(1).map((path, index) => (
        <React.Fragment key={index}>
          <Link href={path} className="first-letter:uppercase text-primary text-xs">
            {path}
          </Link>
          {paths.length !== index + 1 && <ChevronRightIcon />}
        </React.Fragment>
      ))}
    </div>
  );
}