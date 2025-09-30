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
import { CompetencyWithInfo } from "../../type";
import { UseFormReturn } from "react-hook-form";
import { MeritEvaluationSchema } from "../../schema";

interface Props {
  form: UseFormReturn<MeritEvaluationSchema>;
  table: TB<CompetencyWithInfo>
}

const PROHIBIT_COLUMNS = ["comment"];

export const CompetencyEvaluationTable = ({ form, table }: Props) => {
  const competencies = form.watch("competencies");

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
                    "relative h-px border-b-[1.25px] border-[#2377CE]",
                    isLastDataRow && "border-none"
                  )}
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
            <TableRow className="sticky z-85 w-full bottom-0 start-0 grow-0 shrink basis-0">
              <TableCell className="bg-marine border-r-[1.25px] border-[#2377CE] shadow-[inset_0_1.25px_0_rgba(15,15,15,0.1),inset_0_-1.25px_0_rgba(15,15,15,0.1)]" />
              <TableCell className="border-r-[1.25px] border-[#2377CE] shadow-[inset_0_1.25px_0_rgba(15,15,15,0.1),inset_0_-1.25px_0_rgba(15,15,15,0.1)] bg-marine">
                <div className="inline-flex justify-end items-center  pe-1 h-12 w-full">
                  <div className="flex items-center justify-center px-1.5 overflow-hidden whitespace-nowrap">
                    <span className="font-medium text-white text-[10px] uppercase tracking-[1px] me-1 select-none">
                      Sum
                    </span>
                    <span className="text-white text-sm">
                      {convertAmountFromUnit(table.getCoreRowModel().rows.reduce(
                        (acc, row) => acc + (row.original.weight ?? 0),
                        0
                      ), 2).toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2
                      })}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="border-r-[1.25px] border-[#2377CE] shadow-[inset_0_1.25px_0_rgba(15,15,15,0.1),inset_0_-1.25px_0_rgba(15,15,15,0.1)] bg-marine" />
              <TableCell className="border-r-[1.25px] border-[#2377CE] shadow-[inset_0_1.25px_0_rgba(15,15,15,0.1),inset_0_-1.25px_0_rgba(15,15,15,0.1)] bg-marine">
                <div className="inline-flex justify-end items-center pe-1 h-12 w-full">
                  <div className="flex items-center justify-center px-1.5 overflow-hidden whitespace-nowrap">
                    <span className="font-medium text-white text-[10px] uppercase tracking-[1px] me-1 select-none">
                      Sum
                    </span>
                    <span className="text-white text-sm">
                      {(() => {
                          const rowValues = (competencies || []).map((comp, idx) => {
                          const level = Number(comp.levelOwner ?? 0);
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
              <TableCell className="border-r-[1.25px] border-[#2377CE] shadow-[inset_0_1.25px_0_rgba(15,15,15,0.1),inset_0_-1.25px_0_rgba(15,15,15,0.1)] bg-marine">
                <div className="inline-flex justify-end items-center pe-1 h-12 w-full">
                  <div className="flex items-center justify-center px-1.5 overflow-hidden whitespace-nowrap">
                    <span className="font-medium text-white text-[10px] uppercase tracking-[1px] me-1 select-none">
                      Sum
                    </span>
                    <span className="text-white text-sm">
                      {(() => {
                          const rowValues = (competencies || []).map((comp, idx) => {
                          const level = Number(comp.levelChecker ?? 0);
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
              <TableCell className="shadow-[inset_0_1.25px_0_rgba(15,15,15,0.1),inset_0_-1.25px_0_rgba(15,15,15,0.1)] bg-marine">
                <div className="inline-flex justify-end items-center pe-1 h-12 w-full">
                  <div className="flex items-center justify-center px-1.5 overflow-hidden whitespace-nowrap">
                    <span className="font-medium text-white text-[10px] uppercase tracking-[1px] me-1 select-none">
                      Sum
                    </span>
                    <span className="text-white text-sm">
                      {(() => {
                          const rowValues = (competencies || []).map((comp, idx) => {
                          const level = Number(comp.levelApprover ?? 0);
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


