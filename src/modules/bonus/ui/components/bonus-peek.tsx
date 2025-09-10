"use client";

import { BsReverseLayoutSidebarInsetReverse } from "react-icons/bs";
import { useKpiId } from "../../store/use-kpi-id";

interface Props {
  id: string;
}

export const BonusPeek = ({ id }: Props) => {
  const { onOpen } = useKpiId();

  return (
    <div className="flex justify-end absolute top-1.5 inset-x-0 z-2 mx-4">
      <div className="sticky flex bg-[#252525] h-6 p-0.5 dark:shadow-[0_0_0_1px_rgba(48,48,46),0_4px_12px_-2px_rgba(0,0,0,0.16)] rounded end-1 opacity-0 group-hover/row:opacity-100 transition-opacity">
        <div 
          role="button" 
          className="select-none transition flex items-center h-5 px-1 rounded whitespace-nowrap text-xs justify-center font-medium leading-[1.5] bg-[#252525] uppercase tracking-tigh[0.5px] hover:bg-primary/6 gap-2"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();

            onOpen(id);
          }}
        >
          <BsReverseLayoutSidebarInsetReverse className="size-4" />
          Open
        </div>
      </div>
    </div>
  );
}