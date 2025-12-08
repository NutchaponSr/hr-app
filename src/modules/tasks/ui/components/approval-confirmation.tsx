import { useConfirm } from "@/hooks/use-confirm";

import { Button } from "@/components/ui/button";

interface Props {
  disabled: boolean;
  isSaved?: boolean;
  onClick: (confirm: boolean) => void;
}

export const ApprovalConfirmation = ({
  isSaved = false,
  disabled,
  onClick
}: Props) => {
  const [ConfirmDialog, confirm] = useConfirm({
    confirmVariant: "primary",
    title: "Confirm Approval",
    description: "Are you sure you want to approve this KPI bonus?"
  });

  const [UnsavedChangesDialog, confirmUnsavedChanges] = useConfirm({
    confirmVariant: "primary",
    title: "Unsaved Changes",
    description: "You have unsaved changes in the evaluation form. Do you want to approve without saving?",
  });

  const handleApprove = async () => {
    if (!isSaved) {
      const proceedWithoutSaving = await confirmUnsavedChanges();
      if (proceedWithoutSaving) {
        return;
      }

      return;
    }

    const confirmed = await confirm();

    if (confirmed) {
      onClick(true);
    }
  };

  const handleDecline = () => {
    onClick(false);
  };

  return (
    <div className="flex flex-col gap-3 px-16">
      <ConfirmDialog />
      <UnsavedChangesDialog />

      <header className="h-5.5 flex items-center relative">
        <h4 className="text-xs text-foreground leading-4 whitespace-nowrap text-ellipsis overflow-hidden font-medium ps-2">
          KPI Bonus Confirmation
        </h4>
      </header>

      <div className="w-full mx-auto flex items-center gap-12">
        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="rounded-full"
            onClick={handleApprove}
            disabled={disabled}
          >
            Approve
          </Button>
          <Button
            variant="secondary"
            className="rounded-full"
            onClick={handleDecline}
            disabled={disabled}
          >
            Decline
          </Button>
        </div>
      </div>
    </div>
  );
}