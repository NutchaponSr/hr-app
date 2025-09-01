import { useElementHeight } from "@/hooks/use-height";
import { flexRender, Row as R, RowData } from "@tanstack/react-table";
import React, { useEffect } from "react";

interface Props<TData extends RowData> {
  row: R<TData>;
  offset: number;
  onHeightChange: (h: number) => void;
}

export const Row = <TData extends RowData>({ 
  row,
  offset,
  onHeightChange,
}: Props<TData>) => {
  const { ref, height } = useElementHeight({ debounceMs: 50 });

  useEffect(() => {
    if (height > 0) {
      onHeightChange(height)
    }
  }, [height, onHeightChange]);

  return (
    <div
      ref={ref}
      key={row.id}
      className="absolute top-0 start-0 w-full group/row"
      style={{ transform: `translateY(${offset}px)` }}
    >
      <div className="flex w-full border-b-[1.25px] border-border">
        <div className="flex">
          {row.getVisibleCells().map((cell, indexCell) => (
            <React.Fragment key={indexCell}>
              {cell.column.id === "action" ? (
                flexRender(cell.column.columnDef.cell, cell.getContext())
              ) : (
                <div
                  key={indexCell}
                  style={{ width: cell.column.columnDef.meta?.width }}
                  className="flex h-full relative first:border-e-0 border-e-[1.25px] border-border"
                >
                  <div style={{ width: cell.column.columnDef.meta?.width }} className="flex overflow-x-clip h-full">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div 
        data-select={row.getIsSelected()} 
        className="absolute inset-0 -z-86 rounded-[3px] bg-marine/14 data-[select=true]:block hidden" 
        style={{ height: `${height - 1.5}px` }} 
      />
    </div>
  );
}