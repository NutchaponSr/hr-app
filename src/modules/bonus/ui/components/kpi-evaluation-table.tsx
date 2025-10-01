import { Table as TB, flexRender } from "@tanstack/react-table";

import { cn, convertAmountFromUnit } from "@/lib/utils";

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

import { KpiWithEvaluation } from "../../types";

interface Props {
  table: TB<KpiWithEvaluation>;
  totalAchievementOwnerWithWeight: string;
  totalAchievementCheckerWithWeight: string;
  totalAchievementApproverWithWeight: string;
}

const PROHIBIT_COLUMNS = ["action", "comment"];

export const KpiEvaluationTable = ({  
  totalAchievementOwnerWithWeight,
  totalAchievementCheckerWithWeight,
  totalAchievementApproverWithWeight,
  table 
}: Props) => {  
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
                    className="sticky start-8 top-9 z-87 p-0"
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
                      "top-9 z-87",
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
            {table.getRowModel().rows.map((row, rowIndex) => {
              const isLastDataRow = rowIndex === table.getRowModel().rows.length - 1;

              return (
                <TableRow
                  key={row.id}
                  data-selected={row.getIsSelected()}
                  className={cn(
                    "relative h-px border-b-[1.25px] last:border-none border-[#2377CE]",
                    isLastDataRow && "border-none"
                  )}
                >
                  {row.getVisibleCells().map((cell, index, cells) => {
                    const width = cell.column.columnDef.meta?.width;
                    const isSticky = cell.column.columnDef.meta?.sticky;
                    const columnMatched = PROHIBIT_COLUMNS.includes(cell.id.split("_")[1]);
    
                    const isBeforeLast = index === cells.length - 2;
    
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
            <TableRow className="sticky z-85 w-full bottom-11 start-0 grow-0 shrink basis-0">
              <TableCell className="border-r-[1.25px] border-[#2377CE]">
                <div className="inline-flex justify-end items-center bg-marine shadow-[inset_0_1.25px_0_rgba(15,15,15,0.1),inset_0_-1.25px_0_rgba(15,15,15,0.1)] pe-1 h-12 w-full">
                  <div className="flex items-center justify-center px-1.5 overflow-hidden whitespace-nowrap">
                    <span className="font-medium text-white text-[10px] uppercase tracking-[1px] me-1 select-none">
                      Sum
                    </span>
                    <span className="text-white text-sm">
                      {
                        convertAmountFromUnit(table.getCoreRowModel().rows.reduce(
                          (acc, row) => acc + (row.original.weight ?? 0),
                          0
                        ), 2).toLocaleString("en-US", {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2
                        })
                      }
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="border-r-[1.25px] border-[#2377CE]">
                <div className="inline-flex justify-end items-center bg-marine pe-1 h-12 w-full shadow-[inset_0_1.25px_0_rgba(15,15,15,0.1),inset_0_-1.25px_0_rgba(15,15,15,0.1)]">
                  <div className="flex items-center justify-center px-1.5 overflow-hidden whitespace-nowrap">
                    <div className="self-center start-1.5 px-1 py-0.5 bg-[#006fc817] dark:bg-[#439bff3d] text-marine rounded text-[9px] uppercase tracking-wide leading-[1.3] font-medium whitespace-nowrap w-fit me-1.5">
                      Achievement (%) * Weight
                    </div>
                    <span className="font-medium text-white text-[10px] uppercase tracking-[1px] me-1 select-none">
                      Sum
                    </span>
                    <span className="text-white text-sm">
                      {totalAchievementOwnerWithWeight}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="border-r-[1.25px] border-[#2377CE]">
                <div className="inline-flex justify-end items-center bg-marine pe-1 h-12 w-full shadow-[inset_0_1.25px_0_rgba(15,15,15,0.1),inset_0_-1.25px_0_rgba(15,15,15,0.1)]">
                  <div className="flex items-center justify-center px-1.5 overflow-hidden whitespace-nowrap">
                    <div className="self-center start-1.5 px-1 py-0.5 bg-[#006fc817] dark:bg-[#439bff3d] text-marine rounded text-[9px] uppercase tracking-wide leading-[1.3] font-medium whitespace-nowrap w-fit me-1.5">
                      Achievement (%) * Weight
                    </div>
                    <span className="font-medium text-white text-[10px] uppercase tracking-[1px] me-1 select-none">
                      Sum
                    </span>
                    <span className="text-white text-sm">
                      {totalAchievementCheckerWithWeight}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="inline-flex justify-end items-center bg-marine pe-1 h-12 w-full shadow-[inset_0_1.25px_0_rgba(15,15,15,0.1),inset_0_-1.25px_0_rgba(15,15,15,0.1)]">
                  <div className="flex items-center justify-center px-1.5 overflow-hidden whitespace-nowrap ">
                    <div className="self-center start-1.5 px-1 py-0.5 bg-[#006fc817] dark:bg-[#439bff3d] text-marine rounded text-[9px] uppercase tracking-wide leading-[1.3] font-medium whitespace-nowrap w-fit me-1.5">
                      Achievement (%) * Weight
                    </div>
                    <span className="font-medium text-white text-[10px] uppercase tracking-[1px] me-1 select-none">
                      Sum
                    </span>
                    <span className="text-white text-sm">
                      {totalAchievementApproverWithWeight}
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