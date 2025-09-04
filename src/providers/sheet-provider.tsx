"use client";
import { ImportCsvModal } from "@/components/import-csv-modal";
import { useEffect, useState } from "react";

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