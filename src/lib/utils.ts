import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { prefixes } from "@/constants";

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

export function getFirstNameFromFullName(fullName: string): string {
  if (!fullName || typeof fullName !== 'string') {
    return "";
  }
  
  const trimmedName = fullName.trim();
  if (!trimmedName) {
    return "";
  }
  
  let cleaned = trimmedName;
  for (const prefix of prefixes) {
    if (cleaned.startsWith(prefix)) {
      cleaned = cleaned.substring(prefix.length).trim();
      break;
    }
  }
  
  if (!cleaned) {
    return "";
  }
  
  const firstToken = cleaned.split(/\s+/)[0];
  return firstToken ? `คุณ${firstToken}` : "";
};

export function convertAmountFormUnit(amount: number, decimal: number) {
  return amount / Math.pow(10, decimal);
}

export function convertAmountToUnit(amount: number, decimal: number) {
  return Math.round(amount * Math.pow(10, decimal));
}