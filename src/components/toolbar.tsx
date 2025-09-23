import { ChevronDownIcon } from "lucide-react";
import { BsSave, BsFiletypeCsv } from "react-icons/bs";

import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Loader } from "./loader";

interface Props {
  isPending: boolean;
  canPerform: boolean;
  context?: React.ReactNode;
  onCreate?: () => void;
  onDelete?: () => void;
  onUpload?: () => void;
} 

export const Toolbar = ({ 
  isPending,
  canPerform, 
  context,
  onCreate, 
  onUpload,
}: Props) => {
  return (
    <div className="min-h-9 px-24 sticky start-0 top-0 bg-background shrink-0 z-86">
      <div className="relative">
        <div className="flex items-center h-9 start-24">
          <div className="flex items-center h-full grow shrink overflow-hidden w-full">
            {context}
          </div>
          <div className="grow h-full">
            <div className="flex flex-row justify-end items-center h-full gap-0.5">
              <div 
                data-show={canPerform}
                className="relative shrink-0 rounded overflow-hidden h-7 ml-1 data-[show=true]:inline-flex hidden"
              >
                <button type="button" onClick={onCreate} className="transition flex items-center justify-center whitespace-nowrap rounded-l px-2 font-medium bg-marine text-white text-sm hover:bg-marine-muted">
                  New
                </button>
                <button 
                  type="submit" 
                  disabled={isPending}
                  data-disabled={isPending}
                  className="transition flex items-center justify-center whitespace-nowrap px-2 font-medium bg-marine text-white text-sm hover:bg-marine-muted shadow-[inset_1px_0_0_rgba(55,53,47,0.16)] gap-1.5 data-[disabled=true]:opacity-80"
                >
                  {isPending ? (
                    <>
                      <Loader className="!text-white size-4" />
                      Saving
                    </>
                  ) : (
                    <>
                      <BsSave className="stroke-[0.25] size-4" />
                      Save
                    </>
                  )}
                </button>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="transition flex items-center justify-center whitespace-nowrap rounded-r bg-marine shadow-[inset_1px_0_0_rgba(55,53,47,0.16)] text-white text-sm w-6 hover:bg-marine-muted focus-visible:outline-none">
                      <ChevronDownIcon className="size-4" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-[260px] p-1">
                    <h3 className="text-sm data-[inset]:pl-8 select-none flex items-center min-h-7 ps-1 font-medium text-primary">Import</h3>
                    <Button variant="ghost" className="h-auto px-2 w-full" onClick={onUpload}>
                      <div className="flex items-center justify-center min-w-5 min-h-5 self-start">
                        <BsFiletypeCsv className="!stroke-[0.15] size-5 mt-0.5" />
                      </div>
                      <div className="grow shrink basis-auto">
                        <h5 className="whitespace-nowrap overflow-hidden text-ellipsis font-medium text-start">CSV</h5>
                        <p className="text-xs text-tertiary break-words text-start">Upload and process a CSV file</p>
                      </div>
                    </Button>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}