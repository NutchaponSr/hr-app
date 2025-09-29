import { UseFormReturn } from "react-hook-form";
import { ColumnDef } from "@tanstack/react-table";

import { MeritSchema } from "../../schema";
import { CultureWithInfo } from "../../type";
import { FormGenerator } from "@/components/form-generator";
import { SelectionBadge } from "@/components/selection-badge";
import { convertAmountFromUnit } from "@/lib/utils";
import { CommentPopover } from "@/modules/comments/ui/components/comment-popover";

interface Props {
  canPerform: boolean;
  form: UseFormReturn<MeritSchema>;
  comment: (value: { content: string; connectId: string }) => void;
}

export const createColumns = ({ canPerform, form, comment }: Props): ColumnDef<CultureWithInfo>[] => [
  {
    id: "subject",
    header: "Subject",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <SelectionBadge label={row.original.culture!.code} className="w-3 justify-center items-center text-center" />
          <div className="whitespace-break-spaces overflow-hidden text-ellipsis text-sm text-primary leading-5">
            {row.original.culture!.name}
          </div>
        </div>
        <div className="italic underline underline-offset-[1.25px] [word-break:break-word] whitespace-break-spaces overflow-hidden text-ellipsis text-sm text-marine leading-5">
          {`"${row.original.culture!.description}"`}
        </div>
      </div>
    ),
    meta: {
      width: "w-[50%]",
    },
  },
  {
    id: "evidence",
    header: "Evidence",
    cell: ({ row }) => (
      <FormGenerator 
        form={form}
        disabled={!canPerform}
        variant="text"
        name={`cultures.${row.index}.evidence`}
      />
    ),
    meta: {
      width: "w-[40%]",
    },
  },
  {
    id: "weight",
    header: "Weight",
    cell: ({ row }) => (
      convertAmountFromUnit(row.original.weight, 2).toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      })
    ),
    meta: {
      width: "w-[40%]",
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
]