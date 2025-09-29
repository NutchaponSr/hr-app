import { UseFormReturn } from "react-hook-form";
import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

import { FormGenerator } from "@/components/form-generator";

import { CommentPopover } from "@/modules/comments/ui/components/comment-popover";

import { KpiFormSchema } from "@/modules/bonus/schema";
import { KpiWithComments } from "@/modules/bonus/types";
import { kpiCategoies, projectTypes } from "@/modules/bonus/constants";

interface Props {
  canPerform: boolean;
  form: UseFormReturn<KpiFormSchema>;
  comment: (value: { content: string; connectId: string }) => void;
}

export const createColumns = ({ 
  canPerform,
  form,
  comment
}: Props): ColumnDef<KpiWithComments>[] => [
  {
    id: "action",
    header: ({ table }) => (
      <div className="absolute -start-8 top-0 bg-background">
        <div className="h-8 w-8 items-center justify-center flex">
          <Checkbox 
            checked={table.getIsAllRowsSelected() || (table.getIsSomeRowsSelected() && "indeterminate")}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      </div>
    ),
    cell: ({ row }) => (
      <div 
        data-select={row.getIsSelected()} 
        className="opacity-0 group-hover:opacity-100 transition-opacity data-[select=true]:opacity-100"
      >
        <div className="absolute -start-8">
          <div className="size-8 flex items-center justify-center">
            <Checkbox 
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          </div>
        </div>
      </div>
    )
  },
  {
    id: "kpi",
    header: () => "KPI Bonus",
    cell: ({ row }) => {
      const index = row.index;

      return (
      <div className="flex flex-col gap-1.5">
        <div className="grid grid-cols-6 gap-1">
          <FormGenerator 
            form={form}
            label="Category"
            disabled={canPerform}
            name={`kpis.${index}.category`}
            variant="select"
            selectOptions={Object.entries(kpiCategoies).map(([key, label]) => ({ key, label }))}
            className={{
              form: "self-start col-span-2 grow",
            }}
          />
          <FormGenerator 
            form={form}
            label="Name"
            disabled={canPerform}
            name={`kpis.${index}.name`}
            variant="text"
            className={{
              form: "self-start col-span-3 grow",
            }}
          />
          <FormGenerator 
            form={form}
            label="Weight"
            disabled={canPerform}
            name={`kpis.${index}.weight`}
            variant="numeric"
            className={{
              form: "self-start col-span-1 grow",
            }}
          />
        </div>
        <div className="grid grid-cols-3 gap-1">
          <FormGenerator 
            form={form}
            label="Strategy"
            disabled={canPerform}
            name={`kpis.${index}.strategy`}
            variant="string"
            className={{
              form: "self-start col-span-2 grow",
            }}
          />
          <FormGenerator 
            form={form}
            label="KPI's Type"
            disabled={canPerform}
            name={`kpis.${index}.type`}
            variant="select"
            selectOptions={Object.entries(projectTypes).map(([key, label]) => ({ key, label }))}
            className={{
              form: "self-start col-span-1 grow",
            }}
          />
        </div>
        <div className="grid grid-cols-2 gap-1">
          <FormGenerator 
            form={form}
            label="Objective"
            disabled={canPerform}
            name={`kpis.${index}.objective`}
            variant="text"
            className={{
              form: "self-start"
            }}
          />
          <FormGenerator 
            form={form}
            label="Definition"
            disabled={canPerform}
            name={`kpis.${index}.definition`}
            variant="text"
            className={{
              form: "self-start"
            }}
          />
        </div>
      </div>
      );
    },
    meta: {
      width: "w-[40%]",
      sticky: true,
    },
  },
  {
    id: "70%",
    header: () => "Need Improve (< 70%)",
    cell: ({ row }) => (
      <FormGenerator 
        form={form}
        disabled={canPerform}
        name={`kpis.${row.index}.target70`}
        variant="text"
        className={{
          form: "grow",
          input: "h-[192px] min-h-[192px]",
        }}
      />
    ),
    meta: {
      width: "w-[15%]",
    },
  },
  {
    id: "80%",
    header: () => "Level 2 (80%)",
    cell: ({ row }) => (
      <FormGenerator 
        form={form}
        disabled={canPerform}
        name={`kpis.${row.index}.target80`}
        variant="text"
        className={{
          form: "grow",
          input: "h-[192px] min-h-[192px]",
        }}
      />
    ),
    meta: {
      width: "w-[15%]",
    },
  },
  {
    id: "90%",
    header: () => "Level 3 (90%)",
    cell: ({ row }) => (
      <FormGenerator 
        form={form}
        disabled={canPerform}
        name={`kpis.${row.index}.target90`}
        variant="text"
        className={{
          form: "grow",
          input: "h-[192px] min-h-[192px]",
        }}
      />
    ),
    meta: {
      width: "w-[15%]",
    },
  },
  {
    id: "100%",
    header: () => "Meet expert (100%)",
    cell: ({ row }) => (
      <FormGenerator 
        form={form}
        disabled={canPerform}
        name={`kpis.${row.index}.target100`}
        variant="text"
        className={{
          form: "grow",
          input: "h-[192px] min-h-[192px]",
        }}
      />
    ),
    meta: {
      width: "w-[15%]",
    },
  },
  {
    id: "comment",
    cell: ({ row }) => (
      <div className="absolute top-1 left-1 shadow-[0_0_0_1px_rgba(84,72,49,0.08)] dark:shadow-[0_0_0_1px_rgb(48,48,46)] rounded-sm p-0.5 bg-background">
        <CommentPopover 
          canPerform 
          comments={row.original.comments} 
          onCreate={(content) => comment({ connectId: row.original.id, content })}
        />
      </div>
    ),
  },
];