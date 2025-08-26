import { cn } from "@/lib/utils";

import { StatusVariant } from "@/types/kpi";
import { colorVariant } from "@/types/color";

interface Props  {
  label: string;
  variant: StatusVariant;
}

export const StatusBadge = ({ 
  label,
  variant
}: Props) => {
  return (
    <div className={cn(
      colorVariant({ text: variant, background: variant }),
      "flex items-center shrink-0 min-w-0 max-w-full h-5 rounded-md py-1.5 px-2 whitespace-nowrap overflow-hidden text-ellipsis select-none",
    )}>
      <div className="whitespace-nowrap overflow-hidden text-ellipsis inline-flex items-center h-5 leading-5">
        <div className="flex items-center">
          <div className={cn(
            colorVariant({ dot: variant }),
            "rounded-full me-1 size-2 inline-flex shrink-0"
          )} />
        </div>
        <span className="whitespace-nowrap overflow-hidden text-ellipsis text-[10px] font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>
    </div>
  );
}