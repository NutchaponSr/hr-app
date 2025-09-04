import { useShallow } from "zustand/react/shallow";

import { getStepMessage } from "@/lib/utils";

import { useUploadStore } from "@/store/use-upload-modal-store";

export const useUploadSelector = () => {
  const store = useUploadStore();
  
  return {
    // Computed values
    canProceedToParsing: store.file !== null,
    canProceedToMapping: store.parsedData.length > 0,
    canProceedToImport: store.selectedDatabase !== null && Object.keys(store.columnMappings).length > 0,
    hasError: store.status.step === "ERROR",
    isProcessing: ["PARSING", "IMPORTING"].includes(store.status.step),
    isComplete: store.status.step === "SUCCESS",
    
    // Progress helpers
    progressPercent: store.status.progress,
    currentStepMessage: store.status.message || getStepMessage(store.status.step),
    
    // Data helpers
    totalRows: store.parsedData.length,
    totalColumns: store.availableColumns.length,
    mappedColumnsCount: Object.keys(store.columnMappings).length,
    
    ...store,
  };
};

export const useUploadProgress = () => {
  return useUploadStore(
    useShallow((state) => ({
      step: state.status.step,
      progress: state.status.progress,
      message: state.status.message,
      error: state.status.error,
    })),
  );
};

export const useUploadActions = () => {
  return useUploadStore(
    useShallow((state) => ({
      setFile: state.setFile,
      startParsing: state.startParsing,
      completesParsing: state.completesParsing,
      startImporting: state.startImporting,
      completeImport: state.completeImport,
      setError: state.setError,
      reset: state.reset,
      resetToFileSelection: state.resetToFileSelection,
    })),
  );
};

export const useUploadConfig = () => {
  return useUploadStore(
    useShallow((state) => ({
      selectedDatabase: state.selectedDatabase,
      importMethod: state.importMethod,
      setSelectedDatabase: state.setSelectedDatabase,
      setImportMethod: state.setImportMethod,
    })),
  );
};