"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-9999 w-72 origin-(--radix-popover-content-transform-origin) rounded p-4 outline-hidden shadow-[0_14px_28px_-6px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06),0_0_0_1.25px_rgba(84,72,49,0.08)]",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

function PopoverItem({
  label,
  onClick
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <div 
      role="button"
      onClick={onClick}
      className="transition select-none cursor-pointer w-full flex rounded hover:bg-primary/6"  
    >
      <div className="flex items-center gap-2 leading-[120%] w-full select-none min-h-7 text-sm px-2">
        <div className="overflow-ellipsis whitespace-nowrap overflow-hidden">
          <div className="flex text-primary whitespace-nowrap text-sm font-normal">
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor, PopoverItem }
