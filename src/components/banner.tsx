import { IconType } from "react-icons";

import { cn } from "@/lib/utils";

interface Props {
  title: string;
  description?: string;
  className?: string;
  context?: React.ReactNode;
  icon: IconType;
}

export const Banner = ({
  icon: Icon,
  title,
  context,
  className,
  description,
}: Props) => {
  return (
    <section className="w-full flex flex-col items-center shrink-0 grow-0 sticky start-0">
      <div className={cn("max-w-full w-full", className)}>
        <div className="flex w-full h-9" />
        {context}
        <div className="pe-24 mb-2 w-full">
          <div className="flex justify-start flex-row">
            <Icon className="size-9 me-1.5 text-marine" />
            <h1 className="max-w-full w-full whitespace-break-spaces [word-break:break-word] text-primary text-[32px] font-bold leading-[1.2] flex items-center">
              {title}
            </h1>
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