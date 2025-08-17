import { BsChevronDoubleRight, BsFullscreen } from "react-icons/bs";

import {
  Sheet,
  SheetContent,
  SheetHidden
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { BonusCreateForm } from "@/modules/bonus/ui/components/bonus-create-form";

import { useCreateSheetStore } from "@/modules/performance/store/use-create-sheet-store";

export const BonusCreateSheet = () => {
  const { isOpen, type, onClose } = useCreateSheetStore();

  const open = isOpen && type === "kpi-bonus";

  return (
    <Sheet
      open={open}
      onOpenChange={onClose}
    >
      <SheetContent>
        <SheetHidden />
        <div className="flex justify-between h-10 items-center px-3 relative">
          <div className="grid grid-flow-col gap-0.5 items-center">
            <Button variant="ghost" size="iconXs" onClick={onClose}>
              <BsChevronDoubleRight className="stroke-[0.25]" />
            </Button>
            <Button variant="ghost" size="iconXs">
              <BsFullscreen className="stroke-[0.25]" />
            </Button>
          </div>
        </div>
        <ScrollArea className="flex flex-col grow relative overflow-y-auto overflow-x-hidden">
          <div className="w-full flex flex-col relative items-center grow">
            <BonusCreateForm />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}