import { UseFormReturn } from "react-hook-form";
import { MeritSchema } from "../../schema";
import { ColumnDef } from "@tanstack/react-table";
import { CompetencyWithInfo } from "../../type";
import { CompetencyItem } from "./comptency-item";
import { FormGenerator } from "@/components/form-generator";
import { CommentPopover } from "@/modules/comments/ui/components/comment-popover";

interface Props {
  canPerform: boolean;
  form: UseFormReturn<MeritSchema>;
  comment: (value: { content: string; connectId: string }) => void;
}

export const createColumns = ({ canPerform, form, comment }: Props): ColumnDef<CompetencyWithInfo>[] => [
  {
    id: "comptency",
    header: "Comptency",
    cell: ({ row }) => (
      <CompetencyItem 
        form={form}
        index={row.index}
        types={row.original.type}
        label={row.original.label}
        canPerform={!canPerform}
      />
    ),
    meta: {
      width: "w-[25%]"
    }
  },
  {
    id: "weight",
    header: "Weight",
    cell: ({ row }) => (
      <FormGenerator 
        form={form}
        name={`competencies.${row.index}.weight`}
        variant="numeric"
        disabled={!canPerform}
        className={{
          form: "self-start grow",
        }}
      />
    ),
    meta: {
      width: "w-[10%]"
    }
  },
  {
    id: "expectedLevel",
    header: "Expected Level",
    cell: ({ row }) => (
      // TODO: Expected level determine
      <div className="flex flex-col">
        <div className="flex flex-row w-full relative mb-1">
          <div className="flex items-center text-secondary h-8 min-w-16 max-w-16">
            Level 1
          </div>
          <div className="flex h-full grow shrink basis-auto ms-1 min-w-0">
            <div className="flex items-center h-full min-w-0 ms-1 w-full">
              <div data-selected={row.original.expectedLevel === 1} className="transition relative text-sm overflow-hidden inline-block rounded w-full min-h-8 p-1.5 hover:bg-primary/6 ring-marine data-[selected=true]:ring-[1.25px]">
                <div className="text-primary whitespace-break-spaces [word-break:break-word] text-ellipsis text-4.5 overflow-hidden">
                  {row.original.competency?.t1}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row w-full relative mb-1">
          <div className="flex items-center text-secondary h-8 min-w-16 max-w-16">
            Level 2
          </div>
          <div className="flex h-full grow shrink basis-auto ms-1 min-w-0">
            <div className="flex items-center h-full min-w-0 ms-1 w-full">
              <div data-selected={row.original.expectedLevel === 2} className="transition relative text-sm overflow-hidden inline-block rounded w-full min-h-8 p-1.5 hover:bg-primary/6 ring-marine data-[selected=true]:ring-[1.25px]">
                <div className="text-primary whitespace-break-spaces [word-break:break-word] text-ellipsis text-4.5 overflow-hidden">
                  {row.original.competency?.t2}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row w-full relative mb-1">
          <div className="flex items-center text-secondary h-8 min-w-16 max-w-16">
            Level 3
          </div>
          <div className="flex h-full grow shrink basis-auto ms-1 min-w-0">
            <div className="flex items-center h-full min-w-0 ms-1 w-full">
              <div data-selected={row.original.expectedLevel === 3} className="transition relative text-sm overflow-hidden inline-block rounded w-full min-h-8 p-1.5 hover:bg-primary/6 ring-marine data-[selected=true]:ring-[1.25px]">
                <div className="text-primary whitespace-break-spaces [word-break:break-word] text-ellipsis text-4.5 overflow-hidden">
                  {row.original.competency?.t3}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row w-full relative mb-1">
          <div className="flex items-center text-secondary h-8 min-w-16 max-w-16">
            Level 4
          </div>
          <div className="flex h-full grow shrink basis-auto ms-1 min-w-0">
            <div className="flex items-center h-full min-w-0 ms-1 w-full">
              <div data-selected={row.original.expectedLevel === 4} className="transition relative text-sm overflow-hidden inline-block rounded w-full min-h-8 p-1.5 hover:bg-primary/6 ring-marine data-[selected=true]:ring-[1.25px]">
                <div className="text-primary whitespace-break-spaces [word-break:break-word] text-ellipsis text-4.5 overflow-hidden">
                  {row.original.competency?.t4}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row w-full relative mb-1">
          <div className="flex items-center text-secondary h-8 min-w-16 max-w-16">
            Level 5
          </div>
          <div className="flex h-full grow shrink basis-auto ms-1 min-w-0">
            <div className="flex items-center h-full min-w-0 ms-1 w-full">
              <div data-selected={row.original.expectedLevel === 5} className="transition relative text-sm overflow-hidden inline-block rounded w-full min-h-8 p-1.5 hover:bg-primary/6 ring-marine data-[selected=true]:ring-[1.25px]">
                <div className="text-primary whitespace-break-spaces [word-break:break-word] text-ellipsis text-4.5 overflow-hidden">
                  {row.original.competency?.t5}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    meta: {
      width: "w-[35%]"
    }
  },
  {
    id: "plan",
    header: "Plan & Target",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1.5">
        <FormGenerator 
          form={form}
          variant="text"
          label="Input"
          disabled={!canPerform}
          name={`competencies.${row.index}.input`}
        />
        <FormGenerator 
          form={form}
          variant="text"
          label="Output"
          disabled={!canPerform}
          name={`competencies.${row.index}.output`}
        />
      </div>
    ),
    meta: {
      width: "w-[30%]"
    }
  },
  {
    id: "comment",
    cell: ({ row }) => (
      <div className="absolute top-1 left-1 shadow-[0_0_0_1px_rgba(84,72,49,0.08)] dark:shadow-[0_0_0_1px_rgb(48,48,46)] rounded-sm p-0.5 bg-background">
        <CommentPopover 
          canPerform={canPerform}
          comments={row.original.comments} 
          onCreate={(content) => comment({ connectId: row.original.id, content })}
        />
      </div>
    ),
  },
]