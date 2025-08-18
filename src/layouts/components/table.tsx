import { PlusIcon } from "lucide-react";
import { flexRender, Table as TB } from "@tanstack/react-table";
import { inputIcons } from "@/types/inputs";

interface Props<T> {
  table: TB<T>;
  onCreate: () => void;
}

export const Table = <T,>({ table, onCreate }: Props<T>) => {
  return (
    <div className="relative float-left min-w-full select-none pb-[180px] px-24">
      <div className="relative">
        
        {/* Table */}
        <div className="relative mb-3">
          <div className="h-9 relative">
            {table.getHeaderGroups().map((headerGroup) => (
              <div key={headerGroup.id} className="flex bg-background z-87 h-9 text-tertiary shadow-[-3px_0_0_rgba(255,255,255,1),inset_0_-1px_0_rgb(233,233,231)] min-w-[calc(100%-192px)] inset-x-0 relative box-border">
                <div className="inline-flex m-0">
                  {headerGroup.headers.map((header) => {
                    const variant = header.column.columnDef.meta?.variant

                    const Icon = inputIcons[variant ?? "main"];
                    return (
                      <div key={header.id} className="flex flex-row cursor-grab">
                        <div className="flex relative">
                          <div
                            style={{ width: header.column.columnDef.meta?.width }} 
                            className="flex"
                          >
                            {header.id === "action" ? (
                              header.isPlaceholder
                                ? null
                                : flexRender(header.column.columnDef.header,header.getContext())
                            ) : (
                              <button className="transition select-none cursor-pointer flex items-center w-full h-full px-2 hover:bg-primary/4">
                                <div className="flex items-center leading-[120%] text-sm flex-1">
                                  <div className="flex items-center justify-center w-6 h-6 mr-1">
                                    <Icon className="size-4" />
                                  </div>
                                  {header.isPlaceholder
                                    ? null
                                    : flexRender(header.column.columnDef.header,header.getContext())
                                  }
                                </div>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="relative min-w-[calc(100%-192px)] isolation-auto">
            <div  
              style={{ height: `${table.getRowModel().rows.length * 37}px` }}
              className="w-full relative"
            >
              {table.getRowModel().rows.map((row, indexRow) => (
                <div
                  key={row.id}
                  data-index={indexRow}
                  style={{ transform: `translateY(${indexRow * 37}px)` }}
                  className="absolute top-0 start-0 w-full group/row"
                >
                  <div className="flex relative h-[calc(100%+2px)]">
                    <div className="flex w-full border-b-[1.25px] border-[#2a1c0012]">
                      <div className="flex">
                        {row.getVisibleCells().map((cell, indexCell) => (
                          <div
                            key={cell.id}
                            data-row-index={indexRow}
                            data-row-cell={indexCell}
                            style={{ width: cell.column.columnDef.meta?.width }}
                            className="flex h-full relative first:border-e-0 last:border-e-0 border-e-[1.25px] border-[#2a1c0012]"
                          >
                            <div
                              style={{ width: cell.column.columnDef.meta?.width }}
                              className="flex overflow-x-clip h-full"
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center h-9 w-full leading-5 sticky gap-1 start-24.5">
              <button onClick={onCreate} className="hover:bg-primary/6 transition inline-flex h-full w-full">
                <span className="text-sm text-foreground inline-flex items-center sticky start-11 px-2">
                  <PlusIcon className="size-4 mr-1.5" />
                  New
                </span> 
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}