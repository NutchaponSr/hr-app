/* eslint-disable @typescript-eslint/no-explicit-any */
import { BsBoxArrowInDown } from "react-icons/bs";

export const databases = ["kpi"] as const;

export type Database = typeof databases[number];

export type UploadStep = 
  | "SELECT_FILE" 
  | "PARSING" 
  | "PREVIEW" 
  | "MAPPING" 
  | "IMPORTING" 
  | "SUCCESS" 
  | "ERROR";

export type UploadStatus = {
  step: UploadStep;
  progress: number; // 0-100
  message?: string;
  error?: string;
};

export interface UploadState {
  // File management
  file: File | null;
  parsedData: ExcelData;
  
  // Configuration
  selectedDatabase: Database | null;
  importMethod: ImportMethod;
  contextId: string | null;
  
  // UI state
  status: UploadStatus;
  isModalOpen: boolean;
  modalType: Database | null;
  
  // Column mapping (for CSV header mapping)
  columnMappings: Record<string, string>;
  availableColumns: string[];
  
  // Actions
  setFile: (file: File | null) => void;
  setParsedData: (data: ExcelData) => void;
  setSelectedDatabase: (database: Database | null) => void;
  setImportMethod: (method: ImportMethod) => void;
  setStatus: (status: Partial<UploadStatus>) => void;
  setColumnMapping: (csvColumn: string, targetColumn: string) => void;
  setAvailableColumns: (columns: string[]) => void;
  
  // Modal actions
  openModal: (type?: Database, contextId?: string | null) => void;
  closeModal: () => void;
  
  // Process actions
  startParsing: () => void;
  completesParsing: (data: ExcelData) => void;
  startImporting: () => void;
  completeImport: () => void;
  setError: (error: string) => void;
  
  // Reset actions
  reset: () => void;
  resetToFileSelection: () => void;
}

export const IMPORT_METHODS = ["EXISTING"] as const;

export type ImportMethod = typeof IMPORT_METHODS[number];

interface ImportMethodOption {
  key: ImportMethod;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const IMPORT_METHOD_OPTIONS: ImportMethodOption[] = [
  {
    key: "EXISTING",
    label: "Import into existing database",
    description: "You can use this card with a label and a description.",
    icon: BsBoxArrowInDown,
  },
];

export type ExcelData = {
  [key: string]: any;
}[];