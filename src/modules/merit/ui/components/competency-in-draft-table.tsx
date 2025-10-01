import { Table as TB, flexRender } from "@tanstack/react-table";

import { cn } from "@/lib/utils";

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

import { CompetencyWithInfo } from "../../type";

interface Props {
  table: TB<CompetencyWithInfo>;
}

const PROHIBIT_COLUMNS = ["action", "comment"];

export const CompetencyInDraftTable = ({  
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
            {table.getRowModel().rows.map((row) => {
              return (
                <TableRow
                  key={row.id}
                  data-selected={row.getIsSelected()}
                  className={cn(
                    "relative h-px border-b-[1.25px] border-[#2377CE] group data-[selected=true]:inset-x-0 data-[selected=true]:top-[0.5px] data-[selected=true]:bottom-[0.5px] data-[selected=true]:bg-[#2383e224] data-[selected=true]:bg-size-[auto_100px] data-[selected=true]:rounded",
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
                            "align-top px-3 py-2 border-r-[1.25px] border-[#2377CE] border-b-[1.25px]",
                            isBeforeLast && "!rounded-r-sm border-r-0",
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