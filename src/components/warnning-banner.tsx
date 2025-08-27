import { cn } from "@/lib/utils";
import { colorVariant } from "@/types/color";

interface Props {
  message: string | null;
  children?: React.ReactNode;
  variant: "danger" | "warnning";
}

export const WarnningBanner = ({ 
  children, 
  message,
  variant, 
}: Props) => {
  if (!message) return null;

  return (
    <div data-error={!!message} className="w-full select-none data-[error=true]:block hidden sticky left-0">
      <div className={cn(
        "flex items-center justify-center whitespace-nowrap px-3 text-sm text-white font-medium bg-warning min-h-11",
        colorVariant({ background: variant })
      )}>
        <div className="flex items-center justify-center overflow-visible whitespace-normal py-2 px-1">
          {message}
        </div>
        <div className="flex items-center px-3">
          {children}
        </div>
      </div>
    </div>
  );
}