import { SquarePlusIcon } from "lucide-react";
import { GoInbox } from "react-icons/go";

export const Tasks = () => {
  return (
    <article className="relative col-span-1 md:col-span-2">
      <div className="min-h-12 relative">
        <div className="flex items-center h-12 w-full ps-2">
          <div className="flex items-center h-full grow-[10] overflow-hidden -ms-1">
            <div className="flex items-center h-8 px-2.5 py-1.5 max-w-[220px] text-tertiary text-xs whitespace-nowrap space-x-1.5">
              <GoInbox className="size-3 shrink-0 stroke-[0.5]" />
              <span className="whitespace-nowrap text-ellipsis overflow-hidden font-medium">
                My tasks
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col relative max-h-60 rounded bg-white/6 shadow-[0_12px_32px_rgba(0,0,0,0.02),0_0_0_1.25px_rgba(0,0,0,0.089)]">
        <div className="w-full h-[calc(100%-4px)] py-8 flex flex-col items-center justify-center text-center text-sm text-foreground gap-4">
          <SquarePlusIcon className="size-8 stroke-1" />
          No matching tasks
        </div>
      </div>
    </article>
  );
}