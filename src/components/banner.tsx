import { IconType } from "react-icons";

import { cn } from "@/lib/utils";

interface Props {
  title: string;
  description?: string;
  icon: IconType;
  className?: string;
}

export const Banner = ({
  icon: Icon,
  title,
  description,
  className
}: Props) => {
  return (
    <section className="w-full flex flex-col items-center shrink-0 grow-0 sticky start-0">
      <div className={cn("max-w-full w-full", className)}>
        <div className="h-6 w-full flex" />
          <div className="w-full relative md:text-left">
            <div className="mb-2 w-full pr-24">
            <div className="flex justify-start">
              <div className="flex items-center justify-center size-9 relative shrink-0 mr-2">
                <Icon className="size-8 text-marine" />
              </div>
              <h1 className="text-primary font-bold leading-[1.2] text-3xl whitespace-break-spaces break-words">
                {title}
              </h1>
              </div>
            <div className="max-w-full overflow-hidden mb-3">
              <p className="max-w-full w-[780px] whitespace-break-spaces break-words text-primary text-sm">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

Banner.Sub = function BannerSub({
  icon: Icon,
  title
}: Props) {
  return (
    <section className="sticky start-0 mb-1.5">
      <div className="grow min-w-0">
        <div className="flex items-center justify-between w-full py-1">
          <div className="flex items-center overflow-hidden grow shrink basis-0">
            <div className="flex items-center min-w-0 w-max mx-1">
              <div className="relative w-6 h-6 mr-2 flex items-center justify-center">
                <Icon className="size-5 text-tertiary" />
              </div>
              <h2 className="max-w-full w-full whitespace-break-spaces break-all grow shrink basis-0 overflow-hidden font-bold text-2xl text-primary">
                {title}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}