import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { BsBullseye, BsSearch } from "react-icons/bs";
import { useSuspenseQuery } from "@tanstack/react-query";

import { cn } from "@/lib/utils";

import { useTRPC } from "@/trpc/client";

import { MainHeader, MainTitle } from "@/components/main";

import { columns } from "@/modules/tasks/ui/components/tracker-columns";
import { TrackerStat } from "@/modules/tasks/ui/components/tracker-stat";
import { Button } from "@/components/ui/button";
import { CircleDashedIcon } from "lucide-react";
import { Period, Status } from "@/generated/prisma";
import { StatusVariant } from "@/types/kpi";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { colorVariant } from "@/types/color";

const STATUS_RECORD: Record<Status , { label: string; variant: StatusVariant }> = {
  [Status.NOT_STARTED]: { label: "Not Started", variant: "purple" },
  [Status.IN_DRAFT]: { label: "In Draft", variant: "orange" },
  [Status.PENDING_CHECKER]: { label: "Pending Checker", variant: "default" },
  [Status.REJECTED_BY_CHECKER]: { label: "Rejected by Checker", variant: "red" },
  [Status.PENDING_APPROVER]: { label: "Pending Approver", variant: "default" },
  [Status.REJECTED_BY_APPROVER]: { label: "Rejected by Approver", variant: "red" },
  [Status.APPROVED]: { label: "Approved", variant: "green" },
};

type FilterState = {
  search: string;
  status: string[];
};

interface Props {
  year: number;
}

export const Tracker = ({ year }: Props) => {
  const trpc = useTRPC();

  const [globalFilter, setGlobalFilter] = useState<FilterState>({
    search: "",
    status: [],
  });

  const { data: tasks } = useSuspenseQuery(
    trpc.task.getManyByYear.queryOptions({ year }),
  );

  const table = useReactTable({
    data: tasks.employees,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      const filter = filterValue as FilterState;

      const searchValue = (filter.search || "").toLowerCase().trim();
      const statusFilter = filter.status || [];

      if (searchValue) {
        const fullName = row.original.employee.fullName?.toLowerCase() || "";

        if (!fullName.includes(searchValue)) return false;
      }

      if (statusFilter.length > 0) {
        const allTasks = [
          ...(row.original.form.bonus?.tasks || []),
          ...(row.original.form.merit?.tasks || []),
        ];

        if (allTasks.length === 0)
          return statusFilter.includes("NOT_STARTED");

        const hasMatched = allTasks.some((task) =>
          statusFilter.includes(task.status as string),
        );

        if (!hasMatched) return false;
      }

      return true;
    },
  });

  const kpiBonus = table.getRowModel().rows.filter((row) => row.original.form.bonus);
  const merit = table.getRowModel().rows.filter((row) => row.original.form.merit);

  return (
    <>
      <MainHeader>
        <MainTitle>
          <BsBullseye className="size-3 shrink-0" />
          <span className="whitespace-nowrap text-ellipsis overflow-hidden font-medium">
            Evaluation tracker
          </span>
        </MainTitle>
      </MainHeader>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <TrackerStat title="Employee" value={table.getRowModel().rows.length} />
          <TrackerStat
            title="Bonus approved"
            description={
              <ul className="flex flex-col items-start list-disc list-inside">
                <li className="text-xs text-primary">
                  Definition: {" "}
                  <span className="text-marine text-sm font-medium underline underline-offset-2">
                    {kpiBonus.filter((row) => row.original.form.bonus?.tasks?.some((task) => task.status === Status.APPROVED && task.context === "IN_DRAFT")).length}
                  </span>
                </li>
                <li className="text-xs text-primary">
                  Evaluation: {" "}
                  <span className="text-marine text-sm font-medium underline underline-offset-2">
                    {kpiBonus.filter((row) => row.original.form.bonus?.tasks?.some((task) => task.status === Status.APPROVED && task.context === "EVALUATION")).length}
                  </span>
                </li>
              </ul>
            }
          />
          <TrackerStat
            title="Merit approved"
            description={
              <ul className="flex flex-col items-start list-disc list-inside">
                <li className="text-xs text-primary">
                  Definition: {" "}
                  <span className="text-marine text-sm font-medium underline underline-offset-2">
                    {merit.filter((row) => row.original.form.merit?.tasks?.some((task) => task.status === Status.APPROVED && task.context === "IN_DRAFT")).length}
                  </span>
                </li>
                <li className="text-xs text-primary">
                  Evaluation 1st: {" "}
                  <span className="text-marine text-sm font-medium underline underline-offset-2">
                    {merit.filter((row) => row.original.form.merit?.tasks?.some((task) => task.status === Status.APPROVED && task.context === "EVALUATION_1ST")).length}
                  </span>
                </li>
                <li className="text-xs text-primary">
                  Evaluation 2nd: {" "}
                  <span className="text-marine text-sm font-medium underline underline-offset-2">
                    {merit.filter((row) => row.original.form.merit?.tasks?.some((task) => task.status === Status.APPROVED && task.context === "EVALUATION_2ND")).length}
                  </span>
                </li>
              </ul>
            }
          />
          <TrackerStat 
            title="Pending" 
            description={
              <ul className="flex flex-col items-start list-disc list-inside">
                <li className="text-xs text-primary">
                  Bonus: {" "}
                  <span className="text-marine text-sm font-medium underline underline-offset-2">
                    {kpiBonus.filter((row) => row.original.form.bonus?.tasks?.some((task) => task.status === Status.PENDING_APPROVER || task.status === Status.PENDING_CHECKER)).length}
                  </span>
                </li>
                <li className="text-xs text-primary">
                  Merit: {" "}
                  <span className="text-marine text-sm font-medium underline underline-offset-2">
                    {merit.filter((row) => row.original.form.merit?.tasks?.some((task) => task.status === Status.PENDING_APPROVER || task.status === Status.PENDING_CHECKER)).length}
                  </span>
                </li>
              </ul>
            }
          />
        </div>

        <div className="flex items-center flex-wrap gap-y-4 gap-x-1">
          <div className="flex items-center w-full text-xs leading-4 relative rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.08)] bg-accent cursor-text px-2.5 py-1 max-w-[250px] me-auto">
            <BsSearch className="size-3 stroke-[0.2] mr-1.5" />
            <input 
              type="text"
              placeholder="Search..."
              className="w-full text-primary border-none bg-none resize-none focus-visible:outline-none font-normal placeholder:text-foreground"
              value={globalFilter.search || ""}
              onChange={(e) => setGlobalFilter({ ...globalFilter, search: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  table.setGlobalFilter(globalFilter);
                }
              }}
            />
          </div>
          <div className="flex flex-wrap items-stretch gap-y-4 gap-x-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="text-sm font-normal">
                  <CircleDashedIcon />
                  {globalFilter.status.length > 0 
                    ? globalFilter.status.length === 1
                      ? STATUS_RECORD[globalFilter.status[0] as Status].label
                      : `${globalFilter.status.length} labels`
                    : "Status"
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-0" align="end">
                <Command>
                  <CommandInput placeholder="Search status..." />
                  <CommandList className="p-1">
                    {Object.entries(STATUS_RECORD).map(([statusKey, status]) => {
                      const statusKeyString = String(statusKey);
                      const isChecked = globalFilter.status.includes(statusKeyString);
                      return (
                        <CommandItem
                          key={statusKeyString}
                          value={status.label}
                          onSelect={() => {
                            const newStatus = isChecked
                              ? globalFilter.status.filter((s) => s !== statusKeyString)
                              : [...globalFilter.status, statusKeyString];
                            setGlobalFilter({ ...globalFilter, status: newStatus });
                          }}
                          className="cursor-pointer h-7"
                        >
                          <Checkbox checked={isChecked} />
                          <div className={cn("size-2 rounded-full", colorVariant({ background: status.variant }))} />
                          <span className="text-xs font-medium text-primary">{status.label}</span>
                        </CommandItem>
                      );
                    })}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <table className="w-full border-collapse overflow-hidden">
          <thead className="border-y-[1.25px] border-border bg-accent">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{ width: header.column.columnDef.meta?.width }}
                    className={cn(
                      headerGroup.id === "0" && "border-r-[1.25px] border-border border-b-[1.25px]",
                      "border-r-[1.25px] border-border first:border-b-0 last:border-r-0",
                    )}
                  >
                    <div className="flex items-center text-xs text-secondary font-normal h-8 px-2">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-start text-sm text-secondary font-normal h-10 px-2 border-b-[1.25px] border-border">
                  No data found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b-[1.25px] border-border relative group/row">
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={cn("border-r-[1.25px] border-border last:border-r-0")}
                      >
                        <div className="flex items-center text-xs text-secondary font-normal h-10 px-2 relative">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </div>
                      </td>
                    ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};
