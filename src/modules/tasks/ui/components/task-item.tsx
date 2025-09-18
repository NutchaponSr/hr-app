import Link from "next/link";

import { GoProject } from "react-icons/go";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { colorVariant } from "@/types/color";
import { STATUS_RECORD } from "@/types/kpi";
import { App } from "@/generated/prisma";
import { tasks, TaskWithInfo } from "../../type";

interface Props {
  task: TaskWithInfo;
}

export const TaskItem = ({ task }: Props) => {
  const { label, variant } = STATUS_RECORD[task.status];

  const href = task.app === App.BONUS
    ? `/performance/bonus/${task.formId}`
    : `/performance/merit/${task.formId}`

  return (
    <div className="flex relative">
      <Link
        role="link"
        href={href}
        className="flex text-primary select-none transition hover:bg-primary/6 relative grow overflow-hidden rounded h-7.5 items-center px-1"
      >
        <div className="relative text-sm overflow-hidden items-center py-0 px-2 flex grow shrink basis-auto min-h-7.5 min-w-[120px]">
          <div className="max-w-full w-auto whitespace-nowrap break-normal leading-[1.5] overflow-hidden text-ellipsis inline font-medium text-sm">
            {task.owner.fullName}
          </div>
          <div className="whitespace-nowrap overflow-hidden text-ellipsis text-foreground text-xs inline-flex">
            <span className="text-xs whitespace-nowrap overflow-hidden text-ellipsis mx-[0.5em]">
              —
            </span>
            <span className="flex text-xs text-tertiary overflow-hidden">
              {task.year}
            </span>
          </div>
          <div
            className={cn(
              "self-center py-0.5 px-1 bg-purple-foreground text-purple uppercase text-[10px] tracking-wide font-semibold whitespace-nowrap w-fit rounded ms-[1em]",
              colorVariant({ background: variant, text: variant })
            )}
          >
            {label}
          </div>
        </div>
        <div className="leading-[1.5] whitespace-nowrap overflow-hidden text-ellipsis inline text-xs text-foreground">
          {format(task.updatedAt, "dd/LL/yyyy")}
        </div>
        <div className="relative text-sm overflow-hidden items-center py-0 px-2 flex grow-0 shrink-0 basis-auto min-h-7.5 min-w-[100px]">
          <div className="flex flex-row items-center gap-1">
            <div className="flex items-center justify-center size-5 shrink-0">
              <GoProject className="size-4" />
            </div>
            <div className="leading-1 font-medium whitespace-nowrap underline underline-offset-2 decoration-primary/16">
              {tasks[task.app]}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}