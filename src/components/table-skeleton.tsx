import { TableIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface Props {
  name?: string;
}

export const TableSkeleton = ({ name = "New Table" }: Props) => {
  
  return (
    <div className="flex flex-col items-start gap-2 grow shrink basis-[0%] py-2 pe-2">
      <div className="w-full h-full relative">
        <div 
          className="dark:bg-[#202020e6] rounded p-9 gap-[30px] border-[1.25px] border-border absolute select-none inset-0 z-10 flex flex-col"
          style={{
            backgroundImage: "url('/bg-dots.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "70px 70px",
            backgroundPosition: "0% 0%",
            backgroundBlendMode: "multiply",
          }}
        >
          <div className="h-[50px] gap-3 opacity-60 pb-5 border-b-[1.25px] border-border flex flex-row relative items-center self-stretch">
            <TableIcon className="text-tertiary size-8 stroke-[1.75]" />
            <div className="text-tertiary text-[22px] leading-[26px] font-semibold">
              {name}
            </div>
          </div>
          <div className="grid grid-cols-[3fr_2fr_3fr] gap-[45px]">
            <div className="w-full gap-6 flex flex-col relative">
              <SkeletonRow className="w-1/2" />
              <SkeletonRow className="w-full" />
              <SkeletonRow className="w-full" />
              <SkeletonRow className="w-full" />
              <SkeletonRow className="w-full" />
            </div>
            <div className="w-full gap-6 flex flex-col relative">
              <SkeletonRow className="w-1/2" />
              <SkeletonRow className="w-full" />
              <SkeletonRow className="w-full" />
              <SkeletonRow className="w-full" />
              <SkeletonRow className="w-full" />
            </div>
            <div className="w-full gap-6 flex flex-col relative">
              <SkeletonRow className="w-1/2" />
              <SkeletonRow className="w-full" />
              <SkeletonRow className="w-full" />
              <SkeletonRow className="w-full" />
              <SkeletonRow className="w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SkeletonRow = ({ className }: { className?: string }) => {
  return (
    <div className={cn("bg-[#a6a6a6] h-2.5 rounded-full opacity-30", className)} />
  );
}