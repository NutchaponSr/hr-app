import { useMemo, useState } from "react";

import { InputVariants } from "@/types/inputs"

import { SelectionBadge } from "@/components/selection-badge";

interface Props {
  options?: Array<{ key: string; label: string; }>;
  variant: InputVariants;
  value?: string;
  onChange?: (value: string) => void;
}

export const InputGenerator = ({ options, variant, value, onChange }: Props) => {
  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(() => {
  return options?.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );
  }, [options, search]);

  switch (variant) {
    case "text":
      return (
        <div className="p-2 min-h-[34px] flex flex-col justify-between grow text-sm">
          <textarea
            value={value || ""}
            onChange={(e) => onChange?.(e.target.value)}
            rows={1}
            className="break-all whitespace-break-spaces resize-none focus-visible:outline-none field-sizing-content min-h-0 text-primary"
          />
        </div>
      );
    case "numeric":
      return (
        <input
          type="number"
          value={value || ""}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full focus-visible:outline-none h-[34px] px-2 text-sm text-primary"
        />
      );
    case "select":
      return (
        <>
          <div className="flex flex-col min-w-[180px] max-w-[calc(-24px+100vw)] h-full max-h-[70vh]">
            <div className="shrink-0 max-h-60 shadow-[inset_0_-1.25px_rgba(55,53,47,0.16)] overflow-y-auto overflow-x-hidden">
              <div className="flex whitespace-nowrap items-start bg-[#f2f1ee99] dark:bg-white/3 overflow-auto text-sm min-h-7 p-1 rounded-t">
                <div className="flex flex-wrap grow py-1 px-2 gap-1.5">
                  {value ? (
                    <SelectionBadge 
                      label={(options?.find(o => o.key === value)?.label) ?? value} 
                      onClick={() => onChange?.("")} 
                    />
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
            {filteredOptions ? (
              <div role="listbox" className="relative gap-px flex flex-col p-1">
                <div className="flex px-2 my-1.5 text-tertiary font-medium select-none text-xs">
                  <h4 className="self-center whitespace-nowrap overflow-hidden text-ellipsis">
                    Select an option
                  </h4>
                </div>
                <div className="m-0">
                  {filteredOptions?.map(({ key, label }) => (
                    <div 
                      key={key}
                      role="option"
                      aria-selected={value === key}
                      onClick={() => onChange?.(key)}
                      className="flex transition w-full hover:bg-primary/6 rounded cursor-pointer"
                    > 
                      <div className="flex items-center gap-2 px-2 text-sm min-h-7 w-full">
                        <div className="flex-1">
                          <div className="inline-flex items-center shrink max-w-full min-w-0 h-5 rounded-xs px-1.5 leading-[120%] text-sm bg-gray-foreground text-gray-muted dark:text-gray-neutral whitespace-nowrap overflow-hidden text-ellipsis">
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
        </>
      );
  }
}