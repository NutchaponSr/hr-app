import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import { format, isToday, isYesterday } from "date-fns";

import { prefixes } from "@/constants";
import { Status } from "@/generated/prisma";
import { UploadStep } from "@/types/upload";

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

export function convertAmountFromUnit(amount: number, decimal: number) {
  return amount / Math.pow(10, decimal);
}

export function convertAmountToUnit(amount: number, decimal: number) {
  return Math.round(amount * Math.pow(10, decimal));
}

export function findKeyByValue<T extends Record<string, string>>(
  record: T,
  value: T[keyof T] | null | undefined,
) {
  if (!value) return null;

  return (Object.keys(record) as (keyof T)[]).find((key) => record[key] === value);
}

export function getStepMessage(step: UploadStep): string {
  const messages: Record<UploadStep, string> = {
    SELECT_FILE: "Select a file to upload",
    PARSING: "Parsing file...",
    PREVIEW: "Preview your data",
    MAPPING: "Map columns to database fields",
    IMPORTING: "Importing data...",
    SUCCESS: "Import completed successfully!",
    ERROR: "An error occurred",
  };
  
  return messages[step];
}

export function formatDateUpdatedAt(date: Date): string {
  if (isToday(date)) {
    return `Today at ${format(date, "hh:mm aa")}`;
  }

  if (isYesterday(date)) {
    return `Yesterday at ${format(date, "hh:mm aa")}`
  }

  return format(date, "mmm dd, yyyy, hh:mm aa");
}

export function getBannerMessage(error: string | null, status: Status) {
  if (error) return error;

  switch (status) {
    case Status.REJECTED_BY_CHECKER:
      return "This KPI form has been rejected by the Checker. Please review the feedback and resubmit for approval.";
    case Status.REJECTED_BY_APPROVER:
      return "This KPI form has been rejected by the Approver. Please review the feedback and resubmit for approval.";
    default:
      return null;
  }
}