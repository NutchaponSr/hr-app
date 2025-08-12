"use client";

import { BonusCreateSheet } from "@/modules/performance/ui/components/bonus-create-sheet";
import { useEffect, useState } from "react";

export const SheetProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <BonusCreateSheet />
    </>
  );
}