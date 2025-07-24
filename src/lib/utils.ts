import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { env } from "@/env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function VALID_DOMAINS() {
  const domains = ["somboon.co.th"];

  if (env.NODE_ENV === "development") {
    domains.push("@gmail.com");
  }

  return domains;
}