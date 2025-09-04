"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

export type RadioCardOptionProps = {
  value: string;
  id?: string;
  icon?: IconComponent;
  label: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
};

export function RadioCardOption({
  value,
  id,
  icon: Icon,
  label,
  description,
  className
}: RadioCardOptionProps) {
  const descriptionId = React.useMemo(() => {
    if (description == null) return undefined;
    return `${id ?? value}-description`;
  }, [description, id, value]);

  return (
    <div
      className={cn(
        "border-border has-data-[state=checked]:border-marine relative flex items-center gap-2 rounded-md border-[1.25px] p-4 shadow-xs outline-none",
        className
      )}
    >
      <RadioGroupItem
        value={value}
        id={id ?? value}
        aria-describedby={descriptionId}
        className="order-1 after:absolute after:inset-0"
      />
      <div className="flex grow items-start gap-3">
        {Icon ? <Icon className="size-6 stroke-[0.25] text-tertiary" /> : null}
        <div className="grid grow gap-2">
          <Label
            htmlFor={id ?? value}
            className="text-primary leading-5 whitespace-nowrap overflow-hidden text-ellipsis font-medium"
          >
            {label}
          </Label>
          {description ? (
            <p id={descriptionId} className="text-tertiary text-xs">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}


