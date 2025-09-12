import { XIcon } from "lucide-react";

import { 
  useUploadActions, 
  useUploadSelector 
} from "@/hooks/use-upload";
import { useExcelParser } from "@/hooks/use-excel-parser";
import { useUploadStore } from "@/store/use-upload-modal-store";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHidden
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { PreviewTable } from "@/components/preview-table";
import { TableSkeleton } from "@/components/table-skeleton";
import { UploadOperations } from "@/components/upload-operations";

export const ImportCsvModal = () => {
  const {
    file,
    modalType,
    isModalOpen,
    parsedData,
    status,
    reset,
    setFile,
    closeModal
  } = useUploadStore();

  const { handleFileParsing } = useExcelParser();
  const { startParsing, completesParsing, setError } = useUploadActions();
  const { canProceedToParsing } = useUploadSelector();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);
  }

  const onSubmit = async () => {
    if (!file || !canProceedToParsing) return; 

    try {
      startParsing();

      const parsedData = await handleFileParsing(file);

      completesParsing(parsedData);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong");
      }
    }
  }

  return (
    <Dialog 
      open={isModalOpen} 
      onOpenChange={() => {
        closeModal();
        reset();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="max-h-[715px] w-[1150px] max-w-[calc(100vw-100px)] h-[calc(100vh-100px)] overflow-hidden flex mb-0 p-0 bg-[#f9f8f7] dark:bg-popover"
      >
        <DialogHidden />
        <div className="flex flex-col h-full max-h-[715px] max-w-full min-h-[715px] min-w-full w-full">
          <div className="min-w-full max-w-full max-h-[715px] min-h-[715px]">
            {(parsedData.length > 0 && file && status.step === "PREVIEW") ? (
              <PreviewTable 
                data={parsedData} 
                file={file}
                type={modalType}
              />
            ) : (
              <div className="flex flex-row h-full min-h-0 overflow-hidden">
                <div className="flex flex-col h-full w-[32%] relative overflow-hidden">
                  <div className="flex flex-row absolute top-3 start-3 w-6 h-6 items-center justify-center gap-2 shrink-0">
                    <DialogClose asChild>
                      <Button size="iconXs" variant="ghost">
                        <XIcon />
                      </Button>
                    </DialogClose>
                  </div>

                  <UploadOperations 
                    type={modalType} 
                    file={file}
                    canProceed={canProceedToParsing}
                    onSubmit={onSubmit}
                    onRemove={() => setFile(null)}
                    onChange={onChange}
                  />
                </div>
                <TableSkeleton name={file?.name.split(".")[0]} />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}