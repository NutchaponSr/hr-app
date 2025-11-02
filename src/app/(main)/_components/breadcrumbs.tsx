"use client";

import React from "react";
import Link from "next/link";

import { IconType } from "react-icons";
import { HiSlash } from "react-icons/hi2";
import { BsAppIndicator } from "react-icons/bs";

import { Button } from "@/components/ui/button";

interface Props {
  paths: string[];
  nameMap?: Record<string, string>;
  iconMap?: Record<string, IconType>;
  disabledPaths?: string[];
  disabledMap?: Record<string, boolean>;
  disableLastItem?: boolean;
}

export const Breadcrumbs = ({ 
  paths, 
  nameMap = {}, 
  iconMap = {}, 
  disabledPaths = [], 
  disabledMap = {}, 
  disableLastItem = false 
}: Props) => {
  const isUUID = (str: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };

  return (
    <div className="flex items-center leading-[1.2] text-sm h-full grow-0 me-2 min-w-0">
      <Button asChild size="xs" variant="ghost">
        <Link href="/">
          <BsAppIndicator className="stroke-[0.1]" />
          Overviews
        </Link>
      </Button>
      {paths.length > 0 && (
        <span className="w-2 flex items-center justify-center m-0">
          <HiSlash className="size-5 block shrink-0 text-[#d4d3cf] dark:text-[#494846]" />
        </span>
      )}
      {paths.map((path, index) => {
        const href = "/" + paths.slice(0, index + 1).join("/");
        const displayText = nameMap[path] || (isUUID(path) ? "data" : path);
        const IconComponent = iconMap[path];
        const isLastItem = index === paths.length - 1;
        const isDisabled = disabledPaths.includes(path) || disabledMap[path] || (disableLastItem && isLastItem);

        return (
          <React.Fragment key={index}>
            {isDisabled ? (
              <div className="flex items-center gap-1.5 px-2 py-1 text-sm">
                {IconComponent && <IconComponent className="size-4" />}
                <span className="first-letter:uppercase text-primary select-none">
                  {displayText}
                </span>
              </div>
            ) : (
              <Button asChild size="xs" variant="ghost">
                <Link href={href} prefetch>
                  {IconComponent && <IconComponent className="size-4" />}
                  <span className="first-letter:uppercase">
                    {displayText}
                  </span>
                </Link>
              </Button>
            )}
            {index < paths.length - 1 && (
              <span className="w-2 flex items-center justify-center m-0">
                <HiSlash className="size-5 block shrink-0 text-[#d4d3cf] dark:text-[#494846]" />
              </span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}