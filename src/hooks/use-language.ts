"use client";

import { useContext } from "react";

import { InternationalContext } from "@/providers/international-provider";

export const useLanguage = () => {
  const context = useContext(InternationalContext);

  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}