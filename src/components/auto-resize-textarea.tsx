import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

import { cn } from "@/lib/utils";

const textareaVariants = cva(
  "w-full focus-visible:outline-none placeholder:text-primary/26 resize-none overflow-hidden p-0.5", 
  {
    variants: {
      size: {
        default: "text-sm",
        lg: "text-2xl",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, VariantProps<typeof textareaVariants> {
  className?: string;
}

export const AutoResizeTextarea = React.forwardRef<HTMLTextAreaElement, Props>(
  ({ className, size, placeholder = "Empty", onInput, ...props }, ref) => {
    return (
      <textarea
        {...props}
        ref={ref}
        rows={1}
        placeholder={placeholder}
        className={cn(textareaVariants({ size }), className)}
        onInput={(e) => {
          const target = e.currentTarget;
          target.style.height = "auto";
          target.style.height = `${target.scrollHeight}px`;
          onInput?.(e);
        }}
      />
    );
  }
);

AutoResizeTextarea.displayName = "AutoResizeTextarea";