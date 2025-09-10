"use client";

import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface Props {
  label: string;
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  open?: boolean;
}

export const Hint = ({
  children,
  label,
  open,
  ...props
}: Props) => {
  return (
    <Tooltip open={open}>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent {...props} sideOffset={4} className="p-0">
        <p className="px-2 py-1 text-xs text-white font-medium">
          {label}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}