import { useState } from "react";
import { TableIcon } from "lucide-react";

import { Database, ExcelData } from "@/types/upload";

import { useUploadActions } from "@/hooks/use-upload";
import { useUploadStore } from "@/store/use-upload-modal-store";

import { Button } from "@/components/ui/button";

import { validateKpiRows } from "@/modules/bonus/utils";

import { useKpiFormId } from "@/modules/bonus/hooks/use-kpi-form-id";
import { useKpiBonusCreateBulk } from "@/modules/bonus/api/use-kpi-bonus-create-bulk";

interface Props {
  data: ExcelData;
  file: File;
  type: Database | null;
}

export const PreviewTable = ({ 
  data, 
  file,
  type 
}: Props) => {
  const formId = useKpiFormId();

  const columns = Object.keys(data[0] || {}).filter((f) => f !== "_rowIndex");

  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);

  const { contextId, closeModal, reset } = useUploadStore();
  const { setError, resetToFileSelection } = useUploadActions();

  const { mutation: createBulkKpi, invalidate } = useKpiBonusCreateBulk();

  const handleCancel = () => {
    resetToFileSelection();
  };

  const handleConfirm = () => {
    setErrors([]);
    setWarnings([]);

    if (!type) {
      setErrors(["กรุณาเลือกประเภทข้อมูลที่จะนำเข้า"]);
      return;
    }

    if (type === "kpi") {
      const res = validateKpiRows(data);

      if (!res.ok) {
        setErrors([...res.errors]);
        setWarnings([...res.warnings]);
        return;
      }

      if (!contextId) {
        setErrors(["ไม่พบบริบทของแบบฟอร์ม (kpiFormId)"]);
        return;
      }

      createBulkKpi.mutate(
        { kpiFormId: contextId, kpis: res.validRows },
        {
          onSuccess: () => {
            invalidate(formId);
            closeModal();
            reset();
          },
          onError: (e) => {
            setError(e.message || "เกิดข้อผิดพลาดระหว่างนำเข้า");
          },
        }
      );

      return;
    }

    setErrors(["ยังไม่รองรับการนำเข้าประเภทนี้"]);
  };

  return (
    <div className="flex flex-col gap-2 max-h-[715px] min-h-[715px] overflow-hidden p-2">
      <div className="flex items-center my-3 mx-3">
        <div className="me-2 grow">
          <h1 className="text-xl leading-6 font-semibold text-primary">
            Setup CSV columns
          </h1>
          <p className="text-xs leading-4 text-tertiary mt-0">
            Choose the property type for each column in your CSV file
          </p>
        </div>
        <div className="min-w-40">
          <div className="flex flex-row relative w-full gap-2">
            <Button variant="primaryGhost" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirm}>
              Import CSV
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start gap-2 h-full grow shrink basis-0 w-full min-h-0">
        {(errors.length > 0 || warnings.length > 0) && (
          <div className="w-full px-3">
            {errors.length > 0 && (
              <div className="mb-2 rounded border border-red-500/40 bg-red-500/10 text-red-300 p-3 text-sm">
                <div className="font-semibold mb-1">พบข้อผิดพลาด ({errors.length})</div>
                <ul className="list-disc ms-5 space-y-1">
                  {errors.map((e, i) => (
                    <li key={`err-${i}`}>{e}</li>
                  ))}
                </ul>
              </div>
            )}
            {warnings.length > 0 && (
              <div className="mb-2 rounded border border-amber-500/40 bg-amber-500/10 text-amber-300 p-3 text-sm">
                <div className="font-semibold mb-1">คำเตือน ({warnings.length})</div>
                <ul className="list-disc ms-5 space-y-1">
                  {warnings.map((w, i) => (
                    <li key={`warn-${i}`}>{w}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        <div className="rounded relative bg-background h-full w-full pt-9 border-[1.25px] border-border flex flex-col overflow-y-auto">
          <div className="flex items-center ps-9 mt-1 mb-3 mx-0 gap-2">
            <TableIcon className="size-6 text-primary" />
            <h3 className="text-xl leading-6 text-primary whitespace-pre-line overflow-hidden text-ellipsis font-semibold ms-0">
              {file.name.split(".")[0]}
            </h3>
          </div>

          <div className="z-1 h-full overflow-auto pb-7 me-0 mb-0">
            <div className="contents">
              <div className="relative grow shrink">
                <div className="relative float-start min-h-full select-none pb-3 px-9 mt-1">
                  <div className="relative mb-3">
                    <div className="h-9">
                      <div className="flex z-87 h-9 text-tertiary shadow-[inset_0_-1.25px_0_rgba(42,28,0,0.07)] dark:shadow-[inset_0_-1.25px_0_rgb(47,47,47)] inset-x-0 relative">
                        <div className="inline-flex">
                          {columns.map((header, index) => (
                            <div
                              key={index}
                              className="flex relative"
                            >
                              <div className="flex shrink-0 overflow-hidden text-sm p-0 w-[250px]">
                                <div className="select-none transition flex items-center w-full h-full px-2">
                                  <div className="flex items-center leading-[120%] min-w-0 text-sm grow shrink basis-auto">
                                    <div className="whitespace-nowrap text-ellipsis overflow-hidden">
                                      {header}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="relative isolation-auto">
                      {data.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex h-[calc(100%+2px)]">
                          <div className="flex w-full border-b-[1.25px] border-border">
                            <div className="flex overflow-y-clip h-9">
                              {columns.map((key, colIndex) => (
                                <div key={colIndex} className="flex w-[250px] h-full relative not-last:border-e-[1.25px] border-border">
                                  <div className="relative block text-sm text-primary leading-[1.5] overflow-clip w-full whitespace-normal min-h-9 p-2">
                                    <span>
                                      {String(row[key])}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}