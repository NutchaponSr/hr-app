/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import * as XLSX from "xlsx";

import { ExcelData } from "@/types/upload";

export const parseExcel = async (file: File): Promise<ExcelData> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);

    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (jsonData.length > 0) {
      const headers = jsonData[0] as string[];
      const rows = jsonData.slice(1) as any[][];

      const formattedData = rows.map((row, index) => {
        const rowData: { [key: string]: any } = { _rowIndex: index + 2 };
        headers.forEach((header, colIndex) => {
          rowData[header || `Column ${colIndex + 1}`] = row[colIndex] || "";
        });

        return rowData;
      });

      return formattedData;
    } else {
      return [];
    }
  } catch (error) {
    throw new Error(`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}