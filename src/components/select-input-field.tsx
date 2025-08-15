"use client";

import { FieldValues } from "react-hook-form";

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

import { SelectionBadge } from "./selection-badge";
import { useMemo, useState } from "react";
import { SelectInputProps } from "@/types/inputs";



export const SelectInputField = <T extends FieldValues,>({ 
  name, 
  value,
  options,
  watch, 
  onClear,
}: SelectInputProps<T>) => {
  const [search, setSearch] = useState("");

  const displayValue = watch(name)
    ? <SelectionBadge label={value} />
    : "Empty";
    
  const filteredOptions = useMemo(() => {
    return options.filter(opt =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);
    
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="transition hover:bg-primary/6 relative text-sm overflow-hidden inline-block rounded w-full h-8 py-1.5 px-2.5">
          <div className="leading-5 break-words whitespace-pre-wrap text-foreground text-start">
            {displayValue}
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[248px] p-0" sideOffset={-32}>
        <div className="flex flex-col min-w-[180px] max-w-[calc(-24px+100vw)] h-full max-h-[70vh]">
          <div className="shrink-0 max-h-60 shadow-[inset_0_-1.25px_rgba(55,53,47,0.16)] overflow-y-auto overflow-x-hidden">
            <div className="flex whitespace-nowrap items-start bg-[#f2f1ee99] overflow-auto text-sm min-h-7 p-1">
              <div className="flex flex-wrap grow py-1 px-2 gap-1.5">
                {watch(name) ? (
                  <SelectionBadge label={value} onClick={onClear} />
                ) : (
                  <input 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search for an option..."
                    className="w-full focus-visible:outline-none h-5 text-primary placeholder:text-muted"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="grow overflow-y-auto overflow-x-hidden">
          {filteredOptions.length > 0 ? (
            <div role="listbox" className="relative gap-px flex flex-col p-1">
              <div className="flex px-2 my-1.5 text-tertiary font-medium select-none text-xs">
                <h4 className="self-center whitespace-nowrap overflow-hidden text-ellipsis">
                  Select an option
                </h4>
              </div>
              <div className="m-0">
                {filteredOptions.map(({ key, label, onSelect }) => (
                  <div 
                    key={key}
                    role="option"
                    aria-selected={watch(name) === label}
                    onClick={() => onSelect(key)}
                    className="flex transition w-full hover:bg-primary/6 rounded cursor-pointer"
                  > 
                    <div className="flex items-center gap-2 px-2 text-sm min-h-7 w-full">
                      <div className="flex-1">
                        <div className="inline-flex items-center shrink max-w-full min-w-0 h-5 rounded-xs px-1.5 leading-[120%] text-sm bg-gray-foreground text-gray-muted whitespace-nowrap overflow-hidden text-ellipsis">
                          <span className="whitespace-nowrap overflow-hidden text-ellipsis inline-flex items-center h-5 leading-5">
                            {label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="relative p-1 flex flex-col">
              <div className="flex items-center gap-2 leading-[120%] w-full select-none py-1 px-2 mt-0.5 mb-1.5">
                <div className="whitespace-nowrap overflow-hidden text-ellipsis text-tertiary text-xs">
                  No Result
                </div>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}