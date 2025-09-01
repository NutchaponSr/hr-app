import { GripVerticalIcon } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { cn, convertAmountFromUnit } from "@/lib/utils";

import { Kpi } from "@/generated/prisma";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CellInput } from "@/components/cell-input";
import { InputVariants } from "@/types/inputs";
import { SelectionBadge } from "@/components/selection-badge";
import { projectTypes } from "../../constants";

export const createColumns = (
  isScrolled: boolean,
  perform: boolean,
): ColumnDef<Kpi>[] => [
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
      <>
        <div className="sticky start-9 z-85 flex">
          <div className="opacity-100 transition-opacity">
            <div className="absolute -start-9">
              <div className="h-full bg-background">
                <div className="h-full">
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
                {isScrolled && (
                  <div className="flex flex-row h-full">
                    <div className="transition-opacity opacity-100">
                      <div className="absolute top-0 -end-[3px] w-[3px] h-full bg-gradient-to-r from-[rgba(135,131,120,0.4)] via-[rgba(135,131,120,0.1)] to-transparent" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="sticky -left-[56px] flex">
            <div className="absolute -left-[56px]">
              <div className="w-5 h-9 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity">
                <button className="transition flex items-center justify-center w-[18px] h-6 rounded hover:bg-accent cursor-pointer">
                  <GripVerticalIcon className="size-4.5 stroke-[1.7] shrink-0 text-muted" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  },
  {
    accessorKey: "name",
    header: () => "KPI Name (ชื่อ KPI)",
    cell: ({ row, column }) => (
      <CellInput
        perform={perform}
        id={row.original.id}
        data={row.original.name}
        width={column.columnDef.meta?.width}
        variant={column.columnDef.meta!.variant as Exclude<InputVariants, "action">}
        fieldName="name"
        modelType="kpi"
        name="name"
      >
        {(displayValue) => (
          <div className="leading-[1.5] whitespace-pre-wrap break-all text-start">
            <div className="leading-[1.5] whitespace-pre-wrap break-all inline text-sm font-medium text-primary">
              {displayValue}
            </div>
          </div>
        )}
      </CellInput>
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
      <CellInput
        perform={perform}
        id={row.original.id}
        data={row.original.strategy}
        variant={column.columnDef.meta!.variant as Exclude<InputVariants, "action">}
        fieldName="strategy"
        name="strategy"
        modelType="kpi"
      >
        {(displayValue) => (
          <div className="leading-[1.5] whitespace-pre-wrap break-all text-start">
            <div className="leading-[1.5] whitespace-pre-wrap break-all inline text-sm text-primary">
              {displayValue}
            </div>
          </div>
        )}
      </CellInput>
    ),
    meta: {
      width: "160px",
      variant: "text",
    },
  },
  {
    accessorKey: "objective",
    header: () => "Objective (วัตถุประสงค์) ของ KPI",
    cell: ({ row, column }) => (
      <CellInput
        perform={perform}
        id={row.original.id}
        width={column.columnDef.meta?.width}
        variant={column.columnDef.meta!.variant as Exclude<InputVariants, "action">}
        data={row.original.objective}
        fieldName="objective"
        name="objective"
        modelType="kpi"
      >
        {(displayValue) => (
          <div className="leading-[1.5] whitespace-pre-wrap break-all text-start">
            <div className="leading-[1.5] whitespace-pre-wrap break-all inline text-sm text-primary">
              {displayValue}
            </div>
          </div>
        )}
      </CellInput>
    ),
    meta: {
      width: "320px",
      variant: "text",
    },
  },
  {
    accessorKey: "type",
    header: () => "Type",
    cell: ({ row, column }) => (
      <CellInput
        perform={perform}
        id={row.original.id}
        variant={column.columnDef.meta!.variant as Exclude<InputVariants, "action">}
        data={row.original.type}
        modelType="kpi"
        fieldName="type"
        name="type"
        options={Object.entries(projectTypes).map(([key, item]) => ({
          key,
          label: item,
        }))}
      >
        {(displayValue) => (
          <div className="leading-[1.5] whitespace-pre-wrap break-all text-start">
            <div className="leading-[1.5] whitespace-pre-wrap break-all inline text-sm text-primary">
              {displayValue && <SelectionBadge label={displayValue} />}
            </div>
          </div>
        )}
      </CellInput>
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
      <CellInput
        perform={perform}
        id={row.original.id}
        data={convertAmountFromUnit(row.original.weight, 2)}
        width={column.columnDef.meta?.width}
        variant={column.columnDef.meta!.variant as Exclude<InputVariants, "action">}
        modelType="kpi"
        name="weight"
        fieldName="weight"
      >
        {(value) => (
          <div className="leading-[1.5] whitespace-pre-wrap break-all text-left flex justify-end">
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
    accessorKey: "definition",
    header: () => "Measure (หน่วยวัดความสำเร็จ)",
    cell: ({ row, column }) => (
      <CellInput
        perform={perform}
        id={row.original.id}
        variant={column.columnDef.meta!.variant as Exclude<InputVariants, "action">}
        data={row.original.definition}
        modelType="kpi"
        fieldName="definition"
        name="definition"
        options={Object.entries(projectTypes).map(([key, item]) => ({
          key,
          label: item,
        }))}
      >
        {(displayValue) => (
          <div className="leading-[1.5] whitespace-pre-wrap break-all text-start">
            <div className="leading-[1.5] whitespace-pre-wrap break-all inline text-sm text-primary">
              {displayValue}
            </div>
          </div>
        )}
      </CellInput>
    ),
    meta: {
      width: "320px",
      variant: "text",
    },
  },
  {
    id: "target-70",
    header: () => "Target 70%",
    cell: ({ row, column }) => (
      <CellInput
        perform={perform}
        id={row.original.id}
        width={column.columnDef.meta?.width}
        variant={column.columnDef.meta!.variant as Exclude<InputVariants, "action">}
        data={row.original.target70}
        modelType="kpi"
        fieldName="target70"
        name="target70"
      >
        {(displayValue) => (
          <div className="leading-[1.5] whitespace-pre-wrap break-all text-start">
            <div className="leading-[1.5] whitespace-pre-wrap break-all inline text-sm text-primary">
              {displayValue}
            </div>
          </div>
        )}
      </CellInput>
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
      <CellInput
        perform={perform}
        id={row.original.id}
        width={column.columnDef.meta?.width}
        variant={column.columnDef.meta!.variant as Exclude<InputVariants, "action">}
        data={row.original.target80}
        modelType="kpi"
        fieldName="target80"
        name="target80"
      >
        {(displayValue) => (
          <div className="leading-[1.5] whitespace-pre-wrap break-all text-start">
            <div className="leading-[1.5] whitespace-pre-wrap break-all inline text-sm text-primary">
              {displayValue}
            </div>
          </div>
        )}
      </CellInput>
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
      <CellInput
        perform={perform}
        id={row.original.id}
        width={column.columnDef.meta?.width}
        variant={column.columnDef.meta!.variant as Exclude<InputVariants, "action">}
        data={row.original.target90}
        modelType="kpi"
        fieldName="target90"
        name="target90"
      >
        {(displayValue) => (
          <div className="leading-[1.5] whitespace-pre-wrap break-all text-start">
            <div className="leading-[1.5] whitespace-pre-wrap break-all inline text-sm text-primary">
              {displayValue}
            </div>
          </div>
        )}
      </CellInput>
    ),
    meta: {
      width: "270px",
      variant: "text",
    },
  },
  {
    id: "target-100",
    header: () => "Target 100%",
    cell: ({ row, column }) => (
      <CellInput
        perform={perform}
        id={row.original.id}
        width={column.columnDef.meta?.width}
        variant={column.columnDef.meta!.variant as Exclude<InputVariants, "action">}
        data={row.original.target100}
        modelType="kpi"
        fieldName="target100"
        name="target100"
      >
        {(displayValue) => (
          <div className="leading-[1.5] whitespace-pre-wrap break-all text-start">
            <div className="leading-[1.5] whitespace-pre-wrap break-all inline text-sm text-primary">
              {displayValue}
            </div>
          </div>
        )}
      </CellInput>
    ),
    meta: {
      width: "270px",
      variant: "text",
    },
  },
  {
    accessorKey: "createdAt",
    enableHiding: false,
    meta: {
      variant: "text"
    }
  },
];