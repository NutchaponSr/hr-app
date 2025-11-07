import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
  cardNumber?: React.ReactNode;
}

export const Card = ({ children, className, cardNumber }: Props) => {
  return (
    <article className="relative w-full flex group h-full">
      <div className="absolute -top-3 -left-3 z-100">
        {cardNumber}
      </div>
      <div className={cn("select-none transition flex w-full h-30 flex-col justify-between rounded overflow-hidden bg-popover", className)}>
        {children}
      </div>
      <div className="absolute rounded inset-0 z-1 shadow-[0_12px_32px_0_rgba(0,0,0,0.02),0_0_0_1px_rgba(0,0,0,0.05)] group-hover:shadow-[0_12px_32px_0_rgba(0,0,0,0.02),0_0_0_1px_rgba(0,0,0,0.089)] dark:shadow-[unset] group-hover:dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]" />
    </article>
  );
}

export const CardInfo = ({ children, label, className }: { children: React.ReactNode, label: string, className?: string }) => {
  return (
    <div className={cn("grow-0 shrink-0 basis-auto p-2 box-content h-max rounded-sm bg-[#0080d50c] dark:bg-[#298bfd10]", className)}>
      <div className="flex flex-col gap-1.5 h-full">
        <h3 className="text-sm font-medium text-marine">
          {label}
        </h3>
        <div className="shadow-[0_4px_12px_0_rgba(25,25,25,0.029),0_1px_2px_0_rgba(25,25,25,0.019),0_0_0_1px_rgba(0,124,215,0.094)] dark:shadow-[0_4px_12px_0_rgba(25,25,25,0.4),0_0_0_1px_rgba(71,157,255,0.173)] rounded overflow-hidden grow h-auto bg-background">
          {children}
        </div>
      </div>
    </div>
  );
}