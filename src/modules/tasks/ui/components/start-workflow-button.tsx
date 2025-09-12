import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";

interface Props {
  title: string;
  perform: boolean;
  onWorkflow: () => void;
}

export const StartWorkflowButton = ({
  title,
  perform,
  onWorkflow
}: Props) => {
  const [ConfirmationDialog, confirm] = useConfirm({
    title,
    confirmVariant: "primary"
  });

  const onClick = async () => {
    const ok = await confirm();

    if (ok) {
      onWorkflow();
    }
  }

  if (!perform) return null;
 
  return (
    <>
      <ConfirmationDialog />
      <Button 
        size="sm" 
        variant="secondary" 
        onClick={onClick}
      >
        Start Workflow
      </Button>
    </>
  );
}