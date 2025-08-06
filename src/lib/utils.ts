import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function VALID_DOMAINS() {
  const domains = ["somboon.co.th"];

  if (process.env.NODE_ENV === "development") {
    domains.push("@gmail.com");
  }

  return domains;
}