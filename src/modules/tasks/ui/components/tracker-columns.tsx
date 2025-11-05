import { ColumnDef } from "@tanstack/react-table";
import { inferProcedureOutput } from "@trpc/server";

import { AppRouter } from "@/trpc/routers/_app";
import { UserAvatar } from "@/modules/auth/ui/components/user-avatar";
import { StatusBadge } from "@/components/status-badge";
import { STATUS_RECORD } from "@/types/kpi";
import { Status } from "@/generated/prisma";

type TrackerColumn = inferProcedureOutput<AppRouter["task"]["getManyByYear"]>["employees"][0];

export const columns: ColumnDef<TrackerColumn>[] = [
  {
    id: "employee",
    header: "Employee",
    meta: {
      width: "25%",
    },
    columns: [
      {
        id: "name",
        header: "",
        accessorFn: (row) => row.employee.fullName,
        cell: ({ row }) => (
          <div className="flex items-center text-sm w-full justify-between">
            <div className="flex items-center gap-2.5 my-1">
            <UserAvatar
              name={row.original.employee.fullName}
                className={{
                  container: "size-7",
                  fallback: "text-sm"
                }}
              />
              <div className="max-w-50">
                <div className="h-4 self-stretch text-sm font-medium leading-4 whitespace-nowrap overflow-hidden text-ellipsis text-primary">
                  {row.original.employee.fullName}
                </div>
                <div className="h-4 text-xs font-medium leading-3.5 whitespace-nowrap overflow-hidden text-ellipsis text-secondary">
                  {row.original.employee.department}
                </div>
              </div>
            </div>
          </div>
        ),
        meta: {
          width: "25%",
        },
        enableGlobalFilter: true,
      },
    ],
  },
  {
    id: "bonus",
    header: "Bonus",
    columns: [
      {
        id: "definition_bonus",
        header: "Definition",
        cell: ({ row }) => (
          <StatusBadge {...STATUS_RECORD[row.original.form.bonus?.tasks[0]?.status ? row.original.form.bonus?.tasks[0]?.status : Status.NOT_STARTED]} />
        ),
        meta: {
          width: "15%",
        },
        enableGlobalFilter: false,
      },
      {
        id: "evaluation",
        header: "Evaluation",
        cell: ({ row }) => (
          <StatusBadge {...STATUS_RECORD[row.original.form.bonus?.tasks[1]?.status ? row.original.form.bonus?.tasks[1]?.status : Status.NOT_STARTED]} />
        ),
        meta: {
          width: "15%",
        },
        enableGlobalFilter: false,
      },
    ],
    meta: {
      width: "30%",
      colSpan: 2,
    },
  },
  {
    id: "merit",
    header: "Merit",
    columns: [
      {
        id: "definition_merit",
        header: "Definition",
        cell: ({ row }) => (
          <StatusBadge {...STATUS_RECORD[row.original.form.merit?.tasks[0]?.status ? row.original.form.merit?.tasks[0]?.status : Status.NOT_STARTED]} />
        ),
        meta: {
          width: "15%",
        },
        enableGlobalFilter: false,
      },
      {
        header: "Evaluation 1st",
        id: "evaluation1st_merit",  
        cell: ({ row }) => (
          <StatusBadge {...STATUS_RECORD[row.original.form.merit?.tasks[1]?.status ? row.original.form.merit?.tasks[1]?.status : Status.NOT_STARTED]} />
        ),
        meta: {
          width: "15%",
        },
        enableGlobalFilter: false,
      },
      {
        header: "Evaluation 2nd",
        id: "evaluation2nd_merit",
        cell: ({ row }) => (
          <StatusBadge {...STATUS_RECORD[row.original.form.merit?.tasks[2]?.status ? row.original.form.merit?.tasks[2]?.status : Status.NOT_STARTED]} />
        ),
        meta: {
          width: "15%",
        },
        enableGlobalFilter: false,
      },
    ],
    meta: {
      width: "45%",
      colSpan: 3,
    },
  },
];