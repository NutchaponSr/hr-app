import { cn } from "@/lib/utils";
import { flexRender, RowData, Table as TB } from "@tanstack/react-table";

interface Props<TData extends RowData> {
  table: TB<TData>;
}

const PROHIBIT_COLUMNS = ["action", "comment"];

export const Table = <TData extends RowData>({ table }: Props<TData>) => {
  return (
    <table className="mt-0 table-fixed border-collapse min-w-full">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header, index, headers) => {
              const width = header.column.columnDef.meta?.width;
              const columnMatched = PROHIBIT_COLUMNS.includes(header.id);

              const isBeforeLast = index === headers.length - 2;

              return (
                columnMatched ? (
                  <th
                    key={header.id}
                    className="sticky start-8 top-10 z-87"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                    )}
                  </th>
                ) : (
                  <th 
                    key={header.id}
                    className={cn(
                      "sticky top-9 z-20 bg-sidebar px-3 start-0 h-8 shadow-[inset_0_1.25px_0_rgba(42,28,0,0.07),inset_0_-1.25px_0_rgba(42,28,0,0.07)] dark:shadow-[inset_0_1.25px_0_rgba(255,255,243,0.082),inset_0_-1.25px_0_rgba(255,255,243,0.082)] border-r-[1.25px] border-border",
                      isBeforeLast && "border-none",
                      width,
                    )}
                  >
                    <div className="flex items-center h-full">
                      <div className="text-xs font-normal text-secondary whitespace-nowrap overflow-hidden text-ellipsis">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                        )}
                      </div>
                    </div>
                  </th>
                )
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows?.length ? (
          <>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                data-selected={row.getIsSelected()}
                className="relative h-px border-b-[1.25px] border-border group data-[selected=true]:inset-x-0 data-[selected=true]:top-[0.5px] data-[selected=true]:bottom-[0.5px] data-[selected=true]:bg-[#2383e224] data-[selected=true]:bg-size-[auto_100px] data-[selected=true]:rounded"
              >
                {row.getVisibleCells().map((cell, index, cells) => {
                  const width = cell.column.columnDef.meta?.width;
                  const isSticky = cell.column.columnDef.meta?.sticky;
                  const columnMatched = PROHIBIT_COLUMNS.includes(cell.id.split("_")[1]);
  
                  const isBeforeLast = index === cells.length - 2;
                  const isAfterFirst = index === cells.length - 6;
  
                  return (
                    columnMatched ? (
                      <td key={cell.id} className="sticky stroke-9 z-85 flex">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ) : (
                      <td 
                        key={index} 
                        className={cn(
                          "align-top px-3 py-2 dark:last:border-none last:shadow-none border-r-[1.25px] border-border",
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
                      </td>
                    )
                  );
                })}
              </tr>
            ))}
            <tr className="sticky z-85 w-full bottom-0 start-0 grow-0 shrink basis-0"></tr>

          </>
        ) : (
          <tr>
            <td
              colSpan={table.getAllColumns().length}
              className="h-24 text-center"
            >
              No results.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}