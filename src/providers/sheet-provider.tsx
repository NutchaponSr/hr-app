"use client";

import { useEffect, useState } from "react";

import { ImportCsvModal } from "@/components/import-csv-modal";

export const SheetProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <ImportCsvModal />
    </>
  );
}