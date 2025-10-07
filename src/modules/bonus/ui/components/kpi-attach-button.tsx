"use client";

import { useEdgeStore } from "@/lib/edegstore";
import { useRef, useState } from "react"
import { toast } from "sonner";
import { BsEyeFill, BsFileText, BsTrash3 } from "react-icons/bs";
import { Loader } from "@/components/loader";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useKpiFormId } from "../../hooks/use-kpi-form-id";
import { usePeriod } from "@/hooks/use-period";

interface Props {
  id: string;
  value?: string | null;
  canPerform: boolean;
  onChange: (url: string | null) => void;
}

export const KpiAttachButton = ({ id, value, canPerform, onChange }: Props) => {
  const trpc = useTRPC();
  const kpiFormId = useKpiFormId();
  const queryClient = useQueryClient();

  const { edgestore } = useEdgeStore();
  const { period } = usePeriod();

  const [isUploading, setIsUploading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const deleteFile = useMutation(trpc.kpiBonus.deleteKpiFile.mutationOptions());

  const handlePickFile = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      const { url } = await edgestore.publicFiles.upload({ 
        file,
        options: {
          replaceTargetUrl: value || undefined
        } 
      });

      onChange(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleClear = async () => {
    if (!value) return;
    
    setIsUploading(true);
    
    try {
      await edgestore.publicFiles.delete({
        url: value,
      });

      deleteFile.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries(trpc.kpiBonus.getById.queryOptions({ id: kpiFormId, period }));
        }
      })

      onChange(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex items-center gap-2">        
        <div 
          role="button" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            handlePickFile();
          }} 
          data-disabled={canPerform}
          className="transition border-[1.25px] border-border rounded bg-background hover:bg-primary/6 flex items-center py-1 px-2 w-full min-h-8 group/image relative data-[disabled=true]:opacity-80 data-[disabled=true]:pointer-events-none"
        >
          {isUploading ? (
            <>
              <Loader className="size-4 me-1.5 !text-tertiary" />
              <div className="whitespace-nowrap overflow-hidden text-ellipsis text-sm text-primary">
                Uploading...
              </div>
            </>
          ) : (
            <>
              <BsFileText className="size-4 me-1.5 text-tertiary" />
              <div className="whitespace-nowrap overflow-hidden text-ellipsis text-sm text-primary">
                {value ? "Replace" : "Upload"}
              </div>
            </>
          )}

          {value && (
            <div className="absolute right-1 border-[1.25px] border-border rounded bg-background p-0.5 opacity-0 group-hover/image:opacity-100 transition-opacity">
              <div className="flex items-center">
                <div 
                  role="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    window.open(value, "_blank");
                  }}  
                  className="flex items-center justify-center transition size-5 whitespace-nowrap text-xs font-medium text-secondary hover:bg-primary/6 rounded relative"
                >
                  <BsEyeFill className="size-3 shrink-0 text-primary" />
                </div>
                {!canPerform && (
                  <div 
                    role="button" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      handleClear();
                    }}
                    className="flex items-center justify-center transition size-5 whitespace-nowrap text-xs font-medium text-secondary hover:bg-primary/6 rounded relative"
                  >
                    <BsTrash3 className="size-3 shrink-0 text-destructive stroke-[0.25]" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}