import { XIcon } from "lucide-react";
import { cva, VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const badgeVariant = cva("inline-flex items-center shrink max-w-full min-w-0 h-5 rounded-xs px-1.5 leading-[120%] text-sm whitespace-nowrap overflow-hidden text-ellipsis", 
  {
    variants: {
      color: {
        default: "bg-gray-foreground text-gray-muted dark:text-gray-neutral",
        red: "bg-red-foreground text-red-muted",
        orange: "bg-orange-foreground text-orange-muted",
      },
    },
    defaultVariants: {
      color: "default",
    },
  },
);

interface Props extends VariantProps<typeof badgeVariant> {
  label: string;
  onClick?: () => void;
}

export const SelectionBadge = ({
  color,
  label,
  onClick
}: Props) => {
  if (!label) return null;

  return (
    <div className={cn(badgeVariant({ color }))}>
      <span className="whitespace-nowrap overflow-hidden text-ellipsis inline-flex items-center h-5 leading-5">
        {label}
      </span>
      <div 
        role="button" 
        onClick={onClick}
        data-click={!!onClick}
        className="transition hidden items-center justify-center shrink-0 size-4 grow-0 ml-1 hover:bg-primary/6 rounded data-[click=true]:flex"
      >
        <XIcon className="size-3.5 shrink-0 grow-0 text-ter" />
      </div>
    </div>
  );
}