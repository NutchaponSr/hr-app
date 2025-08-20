import { ColumnDef } from "@tanstack/react-table";

import { CompetencyItemWithInfo } from "@/types/kpi";
import { SelectCompetencyPopover } from "./select-competency-popover";
import { CompetencyCellInput } from "./competency-cell-input";
import { convertAmountFromUnit } from "@/lib/utils";

export const columns: ColumnDef<CompetencyItemWithInfo>[] = [
  {
    id: "action"
  },
  {
    id: "name",
    header: "Name",
    cell: ({ row }) => (
      <SelectCompetencyPopover id={row.original.id}>
        <button className="select-none transition cursor-pointer relative block text-sm leading-[1.5] overflow-clip w-full whitespace-nowrap p-2 min-h-9">
          <div className="leading-[1.5] whitespace-pre-wrap break-normal text-start">
            <div className="leading-[1.5] whitespace-pre-wrap break-normal inline text-sm text-primary">
              {row.original.competency?.name}
            </div>
          </div>
        </button>
      </SelectCompetencyPopover>
    ),
    meta: {
      width: "240px",
      variant: "main",
    },
  },
  {
    id: "definition",
    header: "Definition",
    cell: ({ row }) => (
      <button className="select-none transition cursor-pointer relative block text-sm leading-[1.5] overflow-clip w-full whitespace-nowrap p-2 min-h-9">
        <div className="leading-[1.5] whitespace-pre-wrap break-normal text-start">
          <div className="leading-[1.5] whitespace-pre-wrap break-normal inline text-sm text-primary">
            {row.original.competency?.definition}
          </div>
        </div>
      </button>
    ),
    meta: {
      width: "400px",
      variant: "text",
    },
  },
  {
    accessorKey: "input",
    header: "Input & Process",
    cell: ({ row, column }) => (
      <CompetencyCellInput
        id={row.original.id}
        width={column.columnDef.meta?.width}
        variant={column.columnDef.meta!.variant}
        data={row.original.input}
        fieldName="input"
      >
        {(value) => (
          <div className="leading-[1.5] whitespace-pre-wrap break-normal text-start">
            <div className="leading-[1.5] whitespace-pre-wrap break-normal inline text-sm text-primary">
              {value}
            </div>
          </div>
        )}
      </CompetencyCellInput>
    ),
    meta: {
      width: "240px",
      variant: "text",
    },
  },
  {
    accessorKey: "output",
    header: "Output",
    cell: ({ row, column }) => (
      <CompetencyCellInput
        id={row.original.id}
        width={column.columnDef.meta?.width}
        variant={column.columnDef.meta!.variant}
        data={row.original.output}
        fieldName="output"
      >
        {(value) => (
          <div className="leading-[1.5] whitespace-pre-wrap break-normal text-start">
            <div className="leading-[1.5] whitespace-pre-wrap break-normal inline text-sm text-primary">
              {value}
            </div>
          </div>
        )}
      </CompetencyCellInput>
    ),
    meta: {
      width: "240px",
      variant: "text",
    },
  },
  {
    accessorKey: "weight",
    header: "Weight",
    cell: ({ row, column }) => (
      <CompetencyCellInput
        id={row.original.id}
        width={column.columnDef.meta?.width}
        variant={column.columnDef.meta!.variant}
        data={convertAmountFromUnit(row.original.weight, 2)}
        fieldName="weight"
      >
        {(value) => (
          <div className="leading-[1.5] whitespace-pre-wrap break-normal text-start">
            <div className="leading-[1.5] whitespace-pre-wrap break-normal inline text-sm text-primary">
              {value && Number(value).toLocaleString("en-US", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
        )}
      </CompetencyCellInput>
    ),
    meta: {
      width: "100px",
      variant: "numeric",
    },
  },
]