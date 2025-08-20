import { IconType } from "react-icons";
import { GoDotFill } from "react-icons/go";

import { cn } from "@/lib/utils";

import { ArrowUpRightIcon } from "@/components/icons/arrow-right-up";

interface Props {
  className?: string;
  scroll?: {
    icon: IconType;
    label: string;
  };
  label: string;
}

export const BullettedList = ({ 
  className,
  scroll,
  label 
}: Props) => {
  return (
    <div className={cn("w-full max-w-full", className)}>
      <div className="flex items-start w-full ps-0.5 text-tertiary">
        <div className="w-6 flex items-center justify-center grow-0 shrink-0 min-h-[calc(1.5em+6px)]">
          <GoDotFill className="size-4" />
        </div>
        <div className="grow shrink basis-0 flex flex-col">
          <div className="max-w-full w-full text-primary whitespace-break-spaces break-all text-start p-0.5">
            {scroll && (
              <button className="text-tertiary align-top transition hover:bg-primary/6 rounded-xs ps-1">
                <span className="whitespace-nowrap align-middle">
                  <span className="inline-block w-[1em] whitespace-nowrap relative me-[0.5em]">
                    <scroll.icon className="size-[1em] stroke-[0.25]" />
                    <ArrowUpRightIcon className="size-[0.7em] block fill-primary shrink-0 absolute end-[-0.2em] bottom-[-0.15em] stroke-[1] stroke-white" />
                  </span>
                </span>
                <span className="underline font-medium underline-offset-[20%] decoration-primary/25 decoration-[0.05em]">
                  {scroll.label}
                </span>
              </button>
            )}
            : {label}
          </div>
        </div>
      </div>
    </div>
  );
}

