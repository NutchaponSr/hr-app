import { IconType } from "react-icons";

import { cn } from "@/lib/utils";
import { AccordionTrigger } from "./ui/accordion";
import { Button } from "./ui/button";
import { BsTriangleFill } from "react-icons/bs";

interface Props {
  title: string;
  description?: string;
  className?: string;
  subTitle?: string;
  context?: React.ReactNode;
  trigger?: boolean;
  action?: React.ReactNode;
  icon: IconType;
}

export const Banner = ({
  icon: Icon,
  title,
  context,
  className,
  subTitle,
  action,
  description,
  trigger,
}: Props) => {
  return (
    <section className="w-full flex flex-col items-center shrink-0 grow-0">
      <div className={cn("max-w-full w-full h-full", className)}>
        <div className="flex w-full h-6" />
        {context}
        <div className="h-2" />
        <div className="mb-2 w-full">
          <div className="flex justify-start items-center flex-row">
            {trigger && (
              <AccordionTrigger asChild>
                <Button variant="ghost" size="iconXs" className="group">
                  <BsTriangleFill className="text-primary rotate-90 size-3 transition-transform group-data-[state=open]:rotate-180" />
                </Button>
              </AccordionTrigger>
            )}
            <div className="flex justify-start items-center flex-row">
              <Icon className="size-9 me-2.5 text-marine" />
              <h1 className="max-w-full w-auto whitespace-break-spaces [word-break:break-word] text-primary text-[32px] font-bold leading-[1.2] flex items-center">
                {title}
              </h1>
              {subTitle && (
                <div className="whitespace-nowrap overflow-hidden text-ellipsis text-base inline-flex mt-1">
                  <span className="whitespace-nowrap overflow-hidden text-sm mx-[1em] text-tertiary">—</span>
                  <div className="whitespace-nowrap overflow-hidden text-base text-tertiary"> 
                    {subTitle}
                  </div>
                </div>
              )}
            </div>
            {action && (
              <div className="">
                {action}
              </div>
            )}
          </div>
          <div className="w-full overflow-hidden mb-3">
            <div className="flex cursor-text">
              <div className="max-w-full w-[780px] whitespace-break-spaces [word-break:break-word] text-primary text-sm">
                {description}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}