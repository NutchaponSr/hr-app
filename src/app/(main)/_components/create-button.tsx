"use client";

import { ChevronDownIcon } from "lucide-react";

import { useCreateSheetStore } from "@/modules/performance/store/use-create-sheet-store";

export const CreateButton = () => {
  const { onOpen } = useCreateSheetStore();

  return (
    <div className="relative inline-flex shrink-0 rounded overflow-hidden h-7 ml-1">
      <button onClick={onOpen} className="transition flex items-center justify-center whitespace-nowrap rounded-l px-2 font-medium bg-marine text-white text-sm hover:bg-marine-muted">
        New
      </button>
      <button className="transition flex items-center justify-center whitespace-nowrap rounded-r bg-marine shadow-[inset_1px_0_0_rgba(55,53,47,0.16)] text-white text-sm w-6 hover:bg-marine-muted">
        <ChevronDownIcon className="size-4" />
      </button>
    </div>
  );
}