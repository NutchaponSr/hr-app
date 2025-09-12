import { Button } from "@/components/ui/button";

interface Props {
  disabled: boolean;
  onClick: (confirm: boolean) => void; 
}

export const ApprovalConfirmation = ({
  disabled,
  onClick
}: Props) => {
  return (
    <div className="flex flex-col gap-3 px-[116px]">
      <header className="h-5.5 flex items-center relative">
        <h4 className="text-xs text-foreground leading-4 whitespace-nowrap text-ellipsis overflow-hidden font-medium ps-2">
          KPI Bonus confirmation
        </h4>
      </header>

      <div className="w-full mx-auto flex items-center gap-12">
        <div className="flex flex-row gap-2">
          <Button
            variant="secondary"
            className="rounded-full"
            onClick={() => onClick(true)}
            disabled={disabled}
          >
            Approve
          </Button>
          <Button
            variant="secondary"
            className="rounded-full"
            onClick={() => onClick(false)}
            disabled={disabled}
          >
            Decline
          </Button>
        </div>
      </div>
    </div>
  );
}