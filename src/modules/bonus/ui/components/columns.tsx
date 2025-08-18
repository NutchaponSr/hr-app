import { ColumnDef } from "@tanstack/react-table";

import { cn, convertAmountFromUnit } from "@/lib/utils";

import { Kpi } from "@/generated/prisma";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { SelectionBadge } from "@/components/selection-badge";

import { BonusCellInput } from "./bonus-cell-input";

import { projectTypes, strategies } from "@/modules/bonus/constants";

export const columns: ColumnDef<Kpi>[] = [
  {
    id: "action",
    header: ({ table }) => (
      <div className="absolute left-0 top-0 h-full ">
        <div className="sticky -left-9 flex z-999">
          <div className="absolute -left-9">
            <Label className="h-full items-start justify-center flex cursor-pointer group/row">
              <div className={cn(
                "size-9 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity",
                (table.getIsAllRowsSelected() || table.getIsSomePageRowsSelected()) && "opacity-100"
              )}>
                <Checkbox
                  checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                  onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                  aria-label="Select all"
                />
              </div>
            </Label>
          </div>
        </div>
      </div>
    ),
    cell: ({ row }) => (
      <div className="absolute left-0 top-0 h-full">
        <div className="sticky -left-9 flex">
          <div className="absolute -left-9">
            <Label className="h-full items-start justify-center flex cursor-pointer">
              <div className={cn(
                "size-9 flex items-center justify-center opacity-0 group-hover/row:opacity-50 hover:opacity-100 transition-opacity",
                row.getIsSelected() && "opacity-100 group-hover/row:opacity-100"
              )}>
                <Checkbox
                  checked={row.getIsSelected()}
                  onCheckedChange={(value) => row.toggleSelected(!!value)}
                  aria-label="Select row"
                />
              </div>
            </Label>
          </div>
        </div>
      </div>
    )
  },
  {
    accessorKey: "name",
    header: () => "Name",
    cell: ({ row, column }) => (
      <BonusCellInput
        id={row.original.id}
        width={column.columnDef.meta?.width}
        variant={column.columnDef.meta!.variant}
        data={row.original.name}
        fieldName="name"
      >
        {(displayValue) => (
          <button className="select-none transition cursor-pointer relative block text-sm leading-[1.5] overflow-clip w-full whitespace-nowrap h-9 min-h-9 p-2">
            <div className="flex items-start gap-px">
              <div className="leading-[1.5] whitespace-nowrap break-normal inline font-medium me-1 text-sm text-primary">
                {displayValue}
              </div>
            </div>
          </button>
        )}
      </BonusCellInput>
    ),
    meta: {
      width: "320px",
      variant: "main",
    },
  },
  {
    accessorKey: "strategy",
    header: () => "Link to Strategy",
    cell: ({ row, column }) => (
      <BonusCellInput
        id={row.original.id}
        variant={column.columnDef.meta!.variant}
        data={row.original.strategy}
        fieldName="strategy"
        options={Object.entries(strategies).map(([key, item]) => ({
          key,
          label: item,
        }))}
      >
        {(displayValue) => (
          <button className="select-none transition cursor-pointer relative block text-sm leading-[1.5] overflow-clip w-full whitespace-nowrap h-9 min-h-9 p-2">
            <div className="flex items-start gap-px">
              <div className="leading-[1.5] whitespace-nowrap break-normal inline me-1 text-sm text-primary">
                {displayValue && <SelectionBadge label={displayValue} />}
              </div>
            </div>
          </button>
        )}
      </BonusCellInput>
    ),
    meta: {
      width: "160px",
      variant: "select",
    },
  },
  {
    accessorKey: "weight",
    header: () => "Weight",
    cell: ({ row, column }) => (
      <BonusCellInput
        id={row.original.id}
        width={column.columnDef.meta?.width}
        variant={column.columnDef.meta!.variant}
        data={convertAmountFromUnit(row.original.weight, 2)}
        fieldName="weight"
      >
        {(displayValue) => (
          <button className="select-none transition cursor-pointer relative block text-sm leading-[1.5] overflow-clip w-full whitespace-nowrap h-9 min-h-9 p-2">
            <div className="whitespace-nowrap text-end break-normal">
              <div className="leading-[1.5] whitespace-nowrap break-normal inline font-normal me-1 text-sm text-primary">
                {displayValue && Number(displayValue).toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
          </button>
        )}
      </BonusCellInput>
    ),
    meta: {
      width: "100px",
      variant: "numeric",
    },
  },
  {
    accessorKey: "type",
    header: () => "Type",
    cell: ({ row, column }) => (
      <BonusCellInput
        id={row.original.id}
        variant={column.columnDef.meta!.variant}
        data={row.original.type}
        fieldName="type"
        options={Object.entries(projectTypes).map(([key, item]) => ({
          key,
          label: item,
        }))}
      >
        {(displayValue) => (
          <button className="select-none transition cursor-pointer relative block text-sm leading-[1.5] overflow-clip w-full whitespace-nowrap h-9 min-h-9 p-2">
            <div className="whitespace-nowrap leading-[1.5] break-normal text-end">
              <div className="inline items-center text-nowrap text-ellipsis break-normal text-primary text-sm">
               {displayValue && <SelectionBadge label={displayValue} />}
              </div>
            </div>
          </button>
        )}
      </BonusCellInput>
    ),
    meta: {
      width: "160px",
      variant: "select",
    },
  },
  {
    id: "target-100",
    header: () => "Target 100%",
    cell: ({ row, column }) => (
      <BonusCellInput
        id={row.original.id}
        width={column.columnDef.meta?.width}
        variant={column.columnDef.meta!.variant}
        data={row.original.target100}
        fieldName="target100"
      >
        {(displayValue) => (
          <button className="select-none transition cursor-pointer relative block text-sm leading-[1.5] overflow-clip w-full whitespace-nowrap h-9 min-h-9 p-2">
            <div className="flex items-start gap-px">
              <div className="leading-[1.5] whitespace-nowrap break-normal inline font-medium me-1 text-sm text-primary">
                {displayValue}
              </div>
            </div>
          </button>
        )}
      </BonusCellInput>
    ),
    meta: {
      width: "270px",
      variant: "text",
    },
  },
  {
    id: "target-90",
    header: () => "Target 90%",
    cell: ({ row, column }) => (
      <BonusCellInput
        id={row.original.id}
        width={column.columnDef.meta?.width}
        variant={column.columnDef.meta!.variant}
        data={row.original.target90}
        fieldName="target90"
      >
        {(displayValue) => (
          <button className="select-none transition cursor-pointer relative block text-sm leading-[1.5] overflow-clip w-full whitespace-nowrap h-9 min-h-9 p-2">
            <div className="flex items-start gap-px">
              <div className="leading-[1.5] whitespace-nowrap break-normal inline font-medium me-1 text-sm text-primary">
                {displayValue}
              </div>
            </div>
          </button>
        )}
      </BonusCellInput>
    ),
    meta: {
      width: "270px",
      variant: "text",
    },
  },
  {
    id: "target-80",
    header: () => "Target 80%",
    cell: ({ row, column }) => (
      <BonusCellInput
        id={row.original.id}
        width={column.columnDef.meta?.width}
        variant={column.columnDef.meta!.variant}
        data={row.original.target80}
        fieldName="target80"
      >
        {(displayValue) => (
          <button className="select-none transition cursor-pointer relative block text-sm leading-[1.5] overflow-clip w-full whitespace-nowrap h-9 min-h-9 p-2">
            <div className="flex items-start gap-px">
              <div className="leading-[1.5] whitespace-nowrap break-normal inline font-medium me-1 text-sm text-primary">
                {displayValue}
              </div>
            </div>
          </button>
        )}
      </BonusCellInput>
    ),
    meta: {
      width: "270px",
      variant: "text",
    },
  },
  {
    id: "target-70",
    header: () => "Target 70%",
    cell: ({ row, column }) => (
      <BonusCellInput
        id={row.original.id}
        width={column.columnDef.meta?.width}
        variant={column.columnDef.meta!.variant}
        data={row.original.target70}
        fieldName="target70"
      >
        {(displayValue) => (
          <button className="select-none transition cursor-pointer relative block text-sm leading-[1.5] overflow-clip w-full whitespace-nowrap h-9 min-h-9 p-2">
            <div className="flex items-start gap-px">
              <div className="leading-[1.5] whitespace-nowrap break-normal inline font-medium me-1 text-sm text-primary">
                {displayValue}
              </div>
            </div>
          </button>
        )}
      </BonusCellInput>
    ),
    meta: {
      width: "270px",
      variant: "text",
    },
  },
  {
    accessorKey: "definition",
    header: () => "Definition",
    cell: ({ row, column }) => (
      <BonusCellInput
        id={row.original.id}
        width={column.columnDef.meta?.width}
        variant={column.columnDef.meta!.variant}
        data={row.original.definition}
        fieldName="definition"
      >
        {(displayValue) => (
          <button className="select-none transition cursor-pointer relative block text-sm leading-[1.5] overflow-clip w-full whitespace-nowrap h-9 min-h-9 p-2">
            <div className="flex items-start gap-px">
              <div className="leading-[1.5] whitespace-nowrap break-normal inline font-medium me-1 text-sm text-primary">
                {displayValue}
              </div>
            </div>
          </button>
        )}
      </BonusCellInput>
    ),
    meta: {
      width: "320px",
      variant: "text",
    },
  },
]