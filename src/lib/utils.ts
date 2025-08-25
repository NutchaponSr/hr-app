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

export function convertAmountFromUnit(amount: number | null, decimal: number) {
  if (amount === null) return null;
  
  return amount / Math.pow(10, decimal);
}

export function convertAmountToUnit(amount: number | null, decimal: number) {
  if (amount === null) return null;

  return Math.round(amount * Math.pow(10, decimal));
}

export function findKeyByValue<T extends Record<string, string>>(
  record: T,
  value: T[keyof T] | null | undefined,
) {
  if (!value) return null;

  return (Object.keys(record) as (keyof T)[]).find((key) => record[key] === value);
}