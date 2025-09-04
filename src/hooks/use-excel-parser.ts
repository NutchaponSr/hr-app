"use client";

import { useState } from "react";

import type { ExcelData } from "@/types/upload";

import { parseExcel } from "@/actions/parse-excel";

export const useExcelParser = () => {
  const [isParsingFile, setIsParsingFile] = useState(false);
  const handleFileParsing = async (file: File): Promise<ExcelData> => {
    setIsParsingFile(true)
    try {
      const parsedData = await parseExcel(file);

      return parsedData;
    } catch (error) {
      throw error
    } finally {
      setIsParsingFile(false)
    }
  }

  return {
    isParsingFile,
    handleFileParsing,
  }
}