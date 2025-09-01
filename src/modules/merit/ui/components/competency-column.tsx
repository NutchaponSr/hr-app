import { ColumnDef } from "@tanstack/react-table";

import { SelectCompetencyPopover } from "./select-competency-popover";
import { convertAmountFromUnit } from "@/lib/utils";
import { CellInput } from "@/components/cell-input";
import { InputVariants } from "@/types/inputs";
import { CompetencyRecordWithInfo } from "@/types/kpi";

export const createColumns = (perform: boolean):ColumnDef<CompetencyRecordWithInfo>[] => [
  {
    id: "action",
    cell: () => (
      <div />
    )
  },
  {
    id: "name",
    header: "Name",
    cell: ({ row }) => (
      <SelectCompetencyPopover perform={perform} id={row.original.id}>
        <div role="button" className="select-none transition cursor-pointer relative block text-sm leading-[1.5] overflow-clip w-full whitespace-nowrap p-2 min-h-9 items-start justify-start">
          <div className="leading-[1.5] whitespace-pre-wrap break-normal text-start flex items-center gap-2">
            <div className="leading-[1.5] whitespace-pre-wrap break-normal inline text-sm text-primary">
              {row.original.competency?.name}
            </div>
          </div>
        </div>
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
      <div className="select-none transition cursor-pointer relative block text-sm leading-[1.5] overflow-clip w-full whitespace-nowrap p-2 min-h-9">
        <div className="leading-[1.5] whitespace-pre-wrap break-normal text-start">
          <div className="leading-[1.5] whitespace-pre-wrap break-normal inline text-sm text-primary">
            {row.original.competency?.definition}
          </div>
        </div>
      </div>
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
      <CellInput
        perform={perform}
        id={row.original.id}
        width={column.columnDef.meta?.width}
        variant={column.columnDef.meta!.variant as Exclude<InputVariants, "action">}
        modelType="competency"
        data={row.original.input}
        name="inout"
        fieldName="input"
      >
        {(value) => (
          <div className="leading-[1.5] whitespace-pre-wrap break-all text-start">
            <div className="leading-[1.5] whitespace-pre-wrap break-all inline text-sm text-primary">
              {value}
            </div>
          </div>
        )}
      </CellInput>
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
      <CellInput
        perform={perform}
        id={row.original.id}
        width={column.columnDef.meta?.width}
        variant={column.columnDef.meta!.variant as Exclude<InputVariants, "action">}
        data={row.original.output}
        modelType="competency"
        fieldName="output"
        name="output"
      >
        {(value) => (
          <div className="leading-[1.5] whitespace-pre-wrap break-all text-start">
            <div className="leading-[1.5] whitespace-pre-wrap break-all inline text-sm text-primary">
              {value}
            </div>
          </div>
        )}
      </CellInput>
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
      <CellInput
        perform={perform}
        id={row.original.id}
        width={column.columnDef.meta?.width}
        variant={column.columnDef.meta!.variant as Exclude<InputVariants, "action">}
        data={convertAmountFromUnit(row.original.weight, 2)}
        modelType="competency"
        fieldName="weight"
        name="weight"
      >
        {(value) => (
          <div className="leading-[1.5] whitespace-pre-wrap break-all text-start">
            <div className="leading-[1.5] whitespace-pre-wrap break-all inline text-sm text-primary">
              {value && Number(value).toLocaleString("en-US", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
        )}
      </CellInput>
    ),
    meta: {
      width: "100px",
      variant: "numeric",
      calculateType: "sum",
    },
  },
  {
    accessorKey: "createdAt",
    enableHiding: true,
    meta: {
      variant: "text"
    }
  },
]