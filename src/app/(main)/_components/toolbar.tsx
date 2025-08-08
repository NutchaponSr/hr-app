import { ArrowDownUpIcon, ChevronDownIcon, FilterIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Toolbar = () => {
  return (
    <div className="w-full h-9 flex items-center border-b-[1.25px] border-border">
      <TabsList className="h-auto rounded-none bg-transparent gap-0.5">
        <TabsTrigger value="2025">
          2025
        </TabsTrigger>
        <TabsTrigger value="2024">
          2024
        </TabsTrigger>
      </TabsList>

      <div className="grow">
        <div className="flex flex-row items-center justify-end gap-0.5">
          <Button
            size="icon"
            variant="ghost"
          >
            <FilterIcon className="text-muted" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
          >
            <ArrowDownUpIcon className="text-muted" />
          </Button>

          <div className="relative inline-flex shrink-0 rounded overflow-hidden h-7 ml-1">
            <button className="transition flex items-center justify-center whitespace-nowrap rounded-l px-2 font-medium bg-marine text-white text-sm hover:bg-marine-muted">
              New
            </button>
            <button className="transition flex items-center justify-center whitespace-nowrap rounded-r bg-marine shadow-[inset_1px_0_0_rgba(55,53,47,0.16)] text-white text-sm w-6 hover:bg-marine-muted">
              <ChevronDownIcon className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}