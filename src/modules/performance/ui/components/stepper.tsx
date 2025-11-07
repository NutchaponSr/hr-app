import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { colorVariant } from "@/types/color";
import { StatusVariant } from "@/types/kpi";

interface Props {
  date: string;
  title: string;
  description: string;
  status?: {
    label: string;
    variant: StatusVariant;
  };
  action ?: {
    label: string;
    state: boolean; 
    condition?: boolean;
    onClick: () => void;
  }
}

export const Stepper = ({
  date,
  title,
  description,
  status,
  action,
}: Props) => {
  return (
    <div className="flex flex-row not-last:pb-2.5">
      <div className="w-1/4 pe-2.5 flex flex-col text-xs font-medium text-secondary">
        <p>{date}</p>
      </div>
      <div className="w-3/4 flex mb-3.5">
        <div className="flex w-full gap-1 overflow-hidden">
          <div className="w-1 bg-[#54483114] dark:bg-[#2f2f2f] rounded shrink-0" />
          <div className="flex flex-col">
            <div className="flex flex-col flex-1 ps-2.5 overflow-hidden">
              <div className="flex flex-row items-center space-x-2">
                <h4 className="font-medium whitespace-nowrap text-ellipsis overflow-hidden text-secondary">{title}</h4>
                <div 
                  data-has={!!status} 
                  className={cn(
                    "data-[has=true]:block hidden self-center py-0.5 px-1 uppercase text-[10px] font-semibold whitespace-nowrap w-fit rounded tracking-wider",
                    colorVariant({ background: status?.variant, text: status?.variant })
                  )}
                >
                  {status?.label}
                </div>
              </div>
              <p className="text-xs leading-4 mt-0.5">{description}</p>
            </div>

            <div className="mt-1.5 ps-2.5 flex flex-row items-center gap-1.5">
              {action && (
                <Button
                  disabled={action?.state}
                  onClick={action?.onClick}
                  data-active={action?.condition}
                  size="sm"
                  variant="secondary"
                  className="w-fit px-2 py-1 hidden flex-row items-center transition bg-[#5448310a] hover:bg-[#54483114] dark:bg-[#252525] dark:hover:bg-[#2f2f2f] rounded text-xs data-[active=true]:flex text-primary"
                >
                  {action?.label}
                </Button>
              )}
              {/* <button
                disabled={action?.state}
                onClick={action?.onClick}
                data-active={action?.condition}
                className="w-fit px-2 py-1 hidden flex-row items-center transition bg-[#5448310a] hover:bg-[#54483114] dark:bg-[#252525] dark:hover:bg-[#2f2f2f] rounded text-xs data-[active=true]:flex"
              >
                {action?.label}
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}