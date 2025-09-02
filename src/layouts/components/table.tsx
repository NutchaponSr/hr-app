import React, { useCallback, useEffect, useState } from "react";

import { PlusIcon } from "lucide-react";
import { flexRender, Table as TB } from "@tanstack/react-table";

import { inputIcons } from "@/types/inputs";

import { Calculation } from "@/components/calculation";
import { Row } from "../ui/row";

interface Props<T> {
  table: TB<T>;
  perform: boolean;
  onCreate?: () => void;
}

export const Table = <T,>({
  table, 
  perform,
  onCreate 
}: Props<T>) => {
  const [rowHeights, setRowHeights] = useState<Record<string, number>>({})

  useEffect(() => {
    const currentRowIds = new Set(table.getRowModel().rows.map((row) => row.id))

    setRowHeights((prev) => {
      const cleaned = Object.fromEntries(Object.entries(prev).filter(([rowId]) => currentRowIds.has(rowId)))

      // Only update if there were stale entries
      return Object.keys(cleaned).length !== Object.keys(prev).length ? cleaned : prev
    })
  }, [table.getRowModel().rows]);

  const handleHeightChange = useCallback((rowId: string, h: number) => {
    setRowHeights((prev) => {
      if (prev[rowId] === h) return prev
      return { ...prev, [rowId]: h }
    })
  }, [])

  const totalHeight = table.getRowModel().rows.reduce((sum, r) => sum + (rowHeights[r.id] ?? 37), 0)

  return (
    <div className="relative mb-3">
      <div className="h-9 relative">
        {table.getHeaderGroups().map((headerGroup) => (
          <div key={headerGroup.id} className="flex bg-background z-87 h-9 text-tertiary shadow-[-3px_0_0_rgba(255,255,255,1),inset_0_-1px_0_rgb(233,233,231)] dark:shadow-[3px_0_0_rgb(25,25,25),inset_0_-1px_0_rgb(47,47,47)] min-w-[calc(100%-192px)] inset-x-0 relative box-border">
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
        <div style={{ height: `${totalHeight}px` }} className="w-full relative">
          {table.getRowModel().rows.map((row, indexRow) => (
            <Row 
              key={indexRow}
              row={row}
              onHeightChange={(h) => handleHeightChange(row.id, h)}
              offset={table
                .getRowModel()
                .rows.slice(0, indexRow)
                .reduce((sum, r) => sum + (rowHeights[r.id] ?? 37), 0)
              }
            />
          ))}
        </div>
      </div>
      <div 
        data-create={perform && !!onCreate} 
        className="data-[create=true]:flex hidden items-center h-9 w-full leading-5 sticky gap-1 start-24.5 border-b-[1.25px] border-border"
      >
        <button onClick={onCreate} className="hover:bg-primary/6 transition inline-flex h-full w-full">
          <span className="text-sm text-foreground inline-flex items-center sticky start-24 px-2">
            <PlusIcon className="size-4 mr-1.5" />
            New
          </span> 
        </button>
      </div>
      <div className="h-[50px]">
        <div className="relative">
          <div className="select-none flex text-sm min-h-full start-0">
            <div className="flex pe-8">
              <div className="flex">
                {table.getVisibleFlatColumns().slice(1).map((col) => (
                  <div 
                    key={col.id}
                    className="flex"
                    style={{ width: col.columnDef.meta?.width }}
                  >
                    <Calculation column={col} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

