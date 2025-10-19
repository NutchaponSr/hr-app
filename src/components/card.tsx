import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className }: Props) => {
  return (
    <article className="relative w-full flex group">
      <div className={cn("select-none transition flex w-full h-30 flex-col justify-between rounded overflow-hidden bg-popover", className)}>
        {children}
      </div>
      <div className="absolute rounded inset-0 z-1 shadow-[0_12px_32px_0_rgba(0,0,0,0.02),0_0_0_1px_rgba(0,0,0,0.05)] group-hover:shadow-[0_12px_32px_0_rgba(0,0,0,0.02),0_0_0_1px_rgba(0,0,0,0.089)] dark:shadow-[unset] group-hover:dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]" />
    </article>
  );
}