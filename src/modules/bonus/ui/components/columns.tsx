import { ColumnDef } from "@tanstack/react-table";

import { cn, convertAmountFormUnit } from "@/lib/utils";

import { KpiTargetMap } from "@/types/kpi";
import { Kpi, Project, Strategy } from "@/generated/prisma";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { SelectionBadge } from "@/components/selection-badge";

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
    cell: ({ row }) => (
      <div className="flex items-start gap-px">
        <div className="leading-[1.5] whitespace-nowrap break-normal inline font-medium me-1 text-sm text-primary">
          {row.getValue("name")}
        </div>
      </div>
    ),
    meta: {
      width: "320px",
    },
  },
  {
    accessorKey: "strategy",
    header: () => "Link to Strategy",
    cell: ({ row }) => (
      <div className="whitespace-nowrap leading-[1.5] break-normal text-end">
        <div className="inline items-center text-nowrap text-ellipsis break-normal text-primary text-sm">
          <SelectionBadge label={strategies[row.getValue("strategy") as Strategy]} />
        </div>
      </div>
    ),
    meta: {
      width: "160px",
    },
  },
  {
    accessorKey: "weight",
    header: () => "Weight",
    cell: ({ row }) => (
      <div className="whitespace-nowrap leading-[1.5] break-normal text-end">
        <div className="inline items-center text-nowrap text-ellipsis break-normal text-primary text-sm">
          {convertAmountFormUnit(row.getValue("weight"), 2).toFixed(2)}
        </div>
      </div>
    ),
    meta: {
      width: "100px",
    },
  },
  {
    accessorKey: "type",
    header: () => "Type",
    cell: ({ row }) => (
      <div className="whitespace-nowrap leading-[1.5] break-normal text-end">
        <div className="inline items-center text-nowrap text-ellipsis break-normal text-primary text-sm">
          <SelectionBadge label={projectTypes[row.getValue("type") as Project]} />
        </div>
      </div>
    ),
    meta: {
      width: "160px",
    },
  },
  {
    id: "target-100",
    header: () => "Target 100%",
    cell: ({ row }) => (
      <div className="flex items-start gap-px">
        <div className="leading-[1.5] whitespace-nowrap break-normal inline font-medium me-1 text-sm text-primary">
          {(row.original.target as KpiTargetMap)["100"]}
        </div>
      </div>
    ),
    meta: {
      width: "270px",
    },
  },
  {
    id: "target-90",
    header: () => "Target 90%",
    cell: ({ row }) => (
      <div className="flex items-start gap-px">
        <div className="leading-[1.5] whitespace-nowrap break-normal inline font-medium me-1 text-sm text-primary">
          {(row.original.target as KpiTargetMap)["90"]}
        </div>
      </div>
    ),
    meta: {
      width: "270px",
    },
  },
  {
    id: "target-80",
    header: () => "Target 80%",
    cell: ({ row }) => (
      <div className="flex items-start gap-px">
        <div className="leading-[1.5] whitespace-nowrap break-normal inline font-medium me-1 text-sm text-primary">
          {(row.original.target as KpiTargetMap)["80"]}
        </div>
      </div>
    ),
    meta: {
      width: "270px",
    },
  },
  {
    id: "target-70",
    header: () => "Target 70%",
    cell: ({ row }) => (
      <div className="flex items-start gap-px">
        <div className="leading-[1.5] whitespace-nowrap break-normal inline font-medium me-1 text-sm text-primary">
          {(row.original.target as KpiTargetMap)["70"]}
        </div>
      </div>
    ),
    meta: {
      width: "270px",
    },
  },
  {
    accessorKey: "definition",
    header: () => "Definition",
    cell: ({ row }) => (
      <div className="flex items-start gap-px">
        <div className="leading-[1.5] whitespace-nowrap break-normal inline font-medium me-1 text-sm text-primary">
          {(row.getValue("definition"))}
        </div>
      </div>
    ),
    meta: {
      width: "320px",
    },
  },
]