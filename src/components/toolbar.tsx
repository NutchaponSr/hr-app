import { 
  BsArrowDownUp, 
  BsFiletypeCsv, 
  BsFilterCircle 
} from "react-icons/bs";
import { Table } from "@tanstack/react-table";
import { ChevronDownIcon } from "lucide-react";

import { Database } from "@/types/upload";

import { 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import { MenuBar } from "@/components/menu-bar";


interface Props<T> {
  tabTriggers?: {
    value: string;
    onChange: () => void;
  }[];
  table: Table<T>;
  onClick?: () => void;
  onDelete?: () => void;
  onUpload?: () => void;
  perform: boolean;
} 

export const Toolbar = <T,>({ 
  perform, 
  tabTriggers,
  onClick, 
  onUpload,
  ...props 
}: Props<T>) => {
  return (
    <div className="min-h-9 shrink-0 z-86 start-0 sticky px-24">
      <div className="relative">
        <MenuBar perform={perform} {...props} />
        <div className="flex items-center h-9 start-24 border-b-[1.25px] border-border">
          {!!tabTriggers && (
            <TabsList role="tablist" className="flex items-center h-full grow-10 overflow-hidden -ms-1">
              <div className="flex items-center h-full">
                <div className="inline-flex h-full">
                  {tabTriggers.map(({ value, onChange }, index) => (
                    <TabsTrigger 
                      key={index}
                      role="tab"
                      value={value}
                      onClick={onChange}
                    >
                      <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                        {value}
                      </span>
                    </TabsTrigger>
                  ))}
                </div>
              </div>
            </TabsList>
          )}
          <div className="grow h-full">
            <div className="flex flex-row justify-end items-center h-full gap-0.5">
              <Button
                size="iconSm"
                variant="ghost"
              >
                <BsFilterCircle className="stroke-[0.25]" />
              </Button>
              <Button
                size="iconSm"
                variant="ghost"
              >
                <BsArrowDownUp className="stroke-[0.25]" />
              </Button>
              
              <div 
                data-show={perform}
                className="relative shrink-0 rounded overflow-hidden h-7 ml-1 data-[show=true]:inline-flex hidden"
              >
                <button onClick={onClick} className="transition flex items-center justify-center whitespace-nowrap rounded-l px-2 font-medium bg-marine text-white text-sm hover:bg-marine-muted">
                  New
                </button>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="transition flex items-center justify-center whitespace-nowrap rounded-r bg-marine shadow-[inset_1px_0_0_rgba(55,53,47,0.16)] text-white text-sm w-6 hover:bg-marine-muted focus-visible:outline-none">
                      <ChevronDownIcon className="size-4" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-[260px] p-1">
                    <h3 className="text-sm data-[inset]:pl-8 select-none flex items-center min-h-7 ps-1 font-medium">Import</h3>
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