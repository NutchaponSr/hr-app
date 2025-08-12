import { ChevronsRightIcon, MaximizeIcon } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHidden
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

import { BonusCreateForm } from "@/modules/bonus/ui/views/bonus-create-form";

import { useCreateSheetStore } from "@/modules/performance/store/use-create-sheet-store";

export const BonusCreateSheet = () => {
  const { isOpen, onClose } = useCreateSheetStore();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHidden />
        <div className="flex justify-between h-10 items-center px-3 relative">
          <div className="grid grid-flow-col gap-0.5 items-center">
            <Button variant="ghost" size="iconXs" onClick={onClose}>
              <ChevronsRightIcon className="size-4.5" />
            </Button>
            <Button variant="ghost" size="iconXs">
              <MaximizeIcon className="size-4.5" />
            </Button>
          </div>
        </div>
        <div className="w-full flex flex-col relative items-center grow">
          <BonusCreateForm />
        </div>
      </SheetContent>
    </Sheet>
  );
}