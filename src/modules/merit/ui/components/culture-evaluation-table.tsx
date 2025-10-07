import { flexRender, Table as TB } from "@tanstack/react-table";

import { cn, convertAmountFromUnit } from "@/lib/utils";

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { CultureWithInfo } from "../../type";
import { UseFormReturn } from "react-hook-form";
import { MeritEvaluationSchema } from "../../schema";

interface Props {
  perform: boolean;
  hasChecker: boolean;
  isApprovalStatus: boolean;
  form: UseFormReturn<MeritEvaluationSchema>;
  table: TB<CultureWithInfo>
}

const PROHIBIT_COLUMNS = ["comment"];

export const CultureEvaluationTable = ({ perform, hasChecker, isApprovalStatus, form, table }: Props) => {
  const cultures = form.watch("cultures");

  return (
    <Table className="border-x-[1.25px] border-[#2377CE]">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header, index, headers) => {
              const width = header.column.columnDef.meta?.width;
              const columnMatched = PROHIBIT_COLUMNS.includes(header.id);

              const isBeforeLast = index === headers.length - 2;

              return (
                columnMatched ? (
                  <TableHead
                    key={header.id}
                    className="sticky start-8 top-10 z-87 border-none px-0"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                    )}
                  </TableHead>
                ) : (
                  <TableHead 
                    key={header.id}
                    className={cn(
                      "top-9",
                      !perform && "top-2",
                      isApprovalStatus && "top-9",
                      isBeforeLast && "border-none",
                      width,
                    )}
                  >
                    <div className="flex items-center h-full">
                      <div className="text-xs font-normal text-white whitespace-nowrap overflow-hidden text-ellipsis">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                        )}
                      </div>
                    </div>
                  </TableHead>
                )
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          <>
            {table.getRowModel().rows.map((row) => {
              return (
                <TableRow
                  key={row.id}
                  data-selected={row.getIsSelected()}
                  className="relative h-px border-b-[1.25px] border-[#2377CE]"
                >
                  {row.getVisibleCells().map((cell, index, cells) => {
                    const width = cell.column.columnDef.meta?.width;
                    const isSticky = cell.column.columnDef.meta?.sticky;
                    const columnMatched = PROHIBIT_COLUMNS.includes(cell.id.split("_")[1]);
    
                    const isBeforeLast = index === cells.length - 2;
                    const isAfterFirst = index === cells.length - 6;
    
                    return (
                      columnMatched ? (
                        <TableCell key={cell.id} className="sticky stroke-9 z-85 flex">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ) : (
                        <TableCell 
                          key={index} 
                          className={cn(
                            "align-top px-3 py-2 dark:last:border-none last:shadow-none border-r-[1.25px] border-[#2377CE]",
                            isBeforeLast && "border-none dark:border-none !rounded-r-sm",
                            isAfterFirst && "!rounded-l-sm",
                            isSticky && "sticky start-0",
                            width,
                          )}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      )
                    );
                  })}
                </TableRow>
              );
            })}
            <TableRow className={cn(
                "sticky z-85 w-full bottom-11 grow-0 shrink basis-0 shadow-[0_1.25px_0_rgba(15,15,15,0.1),0_-1.25px_0_rgba(15,15,15,0.1)]",
                isApprovalStatus && "bottom-[calc(115px+44px)]",
              )}
            >
              <TableCell colSpan={2} className="bg-marine border-r-[1.25px] border-[#2377CE]" />
              <TableCell className="border-r-[1.25px] border-[#2377CE]">
                <div className="inline-flex justify-end items-center bg-marine pe-1 h-12 w-full">
                  <div className="flex items-center justify-center px-1.5 overflow-hidden whitespace-nowrap">
                    <span className="font-medium text-white text-[10px] uppercase tracking-[1px] me-1 select-none">
                      Sum
                    </span>
                    <span className="text-white text-sm">
                      {(() => {
                          const rowValues = (cultures || []).map((comp, idx) => {
                          const level = Number(comp.levelBehaviorOwner ?? 0);
                          const row = table.getCoreRowModel().rows[idx];
                          const weight = convertAmountFromUnit(row?.original?.weight ?? 0, 2);

                          return (level / table.getRowCount()) * weight;
                        });

                        const sum = rowValues.reduce((acc, val) => acc + val, 0);

                        return sum.toLocaleString("en-US", {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        });
                      })()}
                    </span>
                  </div>
                </div>
              </TableCell>
              {hasChecker && (
                <TableCell className="border-r-[1.25px] border-[#2377CE]">
                  <div className="inline-flex justify-end items-center bg-marine pe-1 h-12 w-full">
                    <div className="flex items-center justify-center px-1.5 overflow-hidden whitespace-nowrap">
                      <span className="font-medium text-white text-[10px] uppercase tracking-[1px] me-1 select-none">
                        Sum
                      </span>
                      <span className="text-white text-sm">
                        {(() => {
                            const rowValues = (cultures || []).map((comp, idx) => {
                            const level = Number(comp.levelBehaviorChecker ?? 0);
                            const row = table.getCoreRowModel().rows[idx];
                            const weight = convertAmountFromUnit(row?.original?.weight ?? 0, 2);

                            return (level / table.getRowCount()) * weight;
                          });

                          const sum = rowValues.reduce((acc, val) => acc + val, 0);

                          return sum.toLocaleString("en-US", {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          });
                        })()}
                      </span>
                    </div>
                  </div>
                </TableCell>
              )}
              <TableCell>
                <div className="inline-flex justify-end items-center bg-marine pe-1 h-12 w-full">
                  <div className="flex items-center justify-center px-1.5 overflow-hidden whitespace-nowrap">
                    <div className="self-center start-1.5 px-1 py-0.5 bg-[#006fc817] dark:bg-[#439bff3d] text-marine rounded text-[9px] uppercase tracking-wide leading-[1.3] font-medium whitespace-nowrap w-fit me-1.5">
                      Level * Weight
                    </div>
                    <span className="font-medium text-white text-[10px] uppercase tracking-[1px] me-1 select-none">
                      Sum
                    </span>
                    <span className="text-white text-sm">
                      {(() => {
                          const rowValues = (cultures || []).map((comp, idx) => {
                          const level = Number(comp.levelBehaviorApprover ?? 0);
                          const row = table.getCoreRowModel().rows[idx];
                          const weight = convertAmountFromUnit(row?.original?.weight ?? 0, 2);

                          return (level / table.getRowCount()) * weight;
                        });

                        const sum = rowValues.reduce((acc, val) => acc + val, 0);

                        return sum.toLocaleString("en-US", {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        });
                      })()}
                    </span>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </>
        ) : (
          <TableRow>
            <TableCell
              colSpan={table.getAllColumns().length}
              className="h-24 text-center"
            >
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
