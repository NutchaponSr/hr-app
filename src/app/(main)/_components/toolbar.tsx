import { ArrowDownUpIcon, FilterIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateButton } from "./create-button";

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
            size="iconSm"
            variant="ghost"
          >
            <FilterIcon className="text-muted" />
          </Button>
          <Button
            size="iconSm"
            variant="ghost"
          >
            <ArrowDownUpIcon className="text-muted" />
          </Button>

          <CreateButton />
        </div>
      </div>
    </div>
  );
}