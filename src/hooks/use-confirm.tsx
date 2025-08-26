import { JSX, useState } from "react";
import { PenLineIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const useConfirm = ({
  className = "w-100",
  title,
  description,
  cancelLabel = "Cancel",
  confirmLabel = "Continue"
}: {
  title?: string;
  description?: string;
  className?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}): [() => JSX.Element, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null);

  const confirmStart = () => new Promise((resolve) => {
    setPromise({ resolve });
  });

  const handleClose = () => {
    setPromise(null);
  }

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  }

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  }

  const ConfirmationDialog = () => (
    <Dialog open={promise !== null}>
      <DialogContent className={cn(className)}>
        <DialogHeader className="flex flex-col relative gap-2 items-center w-full">
          <PenLineIcon className="size-8 text-[#73726e] stroke-[1.5]" />
          <DialogTitle>
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col w-full space-y-1.5">
          <Button variant="destructive" onClick={handleConfirm} className="font-normal h-8">
            {confirmLabel}
          </Button>
          <Button variant="ghost" onClick={handleCancel} className="font-normal h-8">
            {cancelLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return [ConfirmationDialog, confirmStart]
} 