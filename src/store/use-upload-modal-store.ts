import { create } from "zustand";

import { ImportMethod, UploadState, UploadStep } from "@/types/upload";

const initialState = {
  file: null,
  parsedData: [],
  selectedDatabase: null,
  importMethod: "EXISTING" as ImportMethod,
  contextId: null as string | null,
  status: {
    step: "SELECT_FILE" as UploadStep,
    progress: 0,
  },
  isModalOpen: false,
  modalType: null,
  columnMappings: {},
  availableColumns: [],
};

export const useUploadStore = create<UploadState>((set) => ({
      ...initialState,
      setFile: (file) => 
        set(
          (state) => ({
            file,
            // Reset data if file changes
            ...(file?.name !== state.file?.name && {
              parsedData: [],
              status: { step: "SELECT_FILE", progress: 0 },
              columnMappings: {},
              availableColumns: [],
            }),
          }),
        ),

      setParsedData: (data) => 
        set(
          () => ({
            parsedData: data,
            availableColumns: data.length > 0 ? Object.keys(data[0]).filter(key => key !== "_rowIndex") : [],
          }),
        ),

      // Configuration
      setSelectedDatabase: (database) => 
        set(() => ({ selectedDatabase: database })),

      setImportMethod: (method) => 
        set(() => ({ importMethod: method })),

      // Status management
      setStatus: (statusUpdate) => 
        set(
          (state) => ({
            status: { ...state.status, ...statusUpdate },
          }),
        ),

      // Column mapping
      setColumnMapping: (csvColumn, targetColumn) => 
        set(
          (state) => ({
            columnMappings: {
              ...state.columnMappings,
              [csvColumn]: targetColumn,
            },
          }),
        ),

      setAvailableColumns: (columns) => 
        set(() => ({ availableColumns: columns })),

      // Modal actions
      openModal: (type, contextId) => 
        set(
          () => ({
            isModalOpen: true,
            modalType: type || null,
            selectedDatabase: type || null,
            contextId: contextId || null,
          }),
        ),

      closeModal: () => 
        set(
          () => ({
            isModalOpen: false,
            modalType: null,
          }),
        ),

      // Process actions
      startParsing: () => 
        set(
          () => ({
            status: {
              step: "PARSING",
              progress: 10,
              message: "Parsing file...",
            },
          }),
        ),

      completesParsing: (data) => 
        set(
          () => ({
            parsedData: data,
            availableColumns: data.length > 0 ? Object.keys(data[0]).filter(key => key !== "_rowIndex") : [],
            status: {
              step: "PREVIEW",
              progress: 50,
              message: "File parsed successfully",
            },
          }),
        ),

      startImporting: () => 
        set(
          () => ({
            status: {
              step: "IMPORTING",
              progress: 75,
              message: "Importing data...",
            },
          }),
        ),

      completeImport: () => 
        set(
          () => ({
            status: {
              step: "SUCCESS",
              progress: 100,
              message: "Import completed successfully!",
            },
          }),
        ),

      setError: (error) => 
        set(
          () => ({
            status: {
              step: "ERROR",
              progress: 0,
              error,
            },
          }),
        ),

      // Reset actions
      reset: () => 
        set(() => ({ ...initialState })),

      resetToFileSelection: () => 
        set(
          (state) => ({
            parsedData: [],
            status: {
              step: "SELECT_FILE",
              progress: 0,
            },
            columnMappings: {},
            availableColumns: [],
            // Keep file, database selection, and import method
            file: state.file,
            selectedDatabase: state.selectedDatabase,
            importMethod: state.importMethod,
          }),
        ),
}))
