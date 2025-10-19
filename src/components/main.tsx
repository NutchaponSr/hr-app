import { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const Main = ({ children }: Props) => {
  return (
    <main className="grow-0 shrink flex flex-col bg-background z-1 h-full max-h-full w-full">
      <div className="w-full h-full overflow-x-hidden overflow-y-auto me-0 mb-0">
        <div className="grid grid-cols-[minmax(20px,1fr)_minmax(auto,840px)_minmax(20px,1fr)] w-full gap-y-6 gap-x-14 pb-[30vh]">
          {children}
        </div>
      </div>
    </main>
  );
}

export const MainContent = ({ children, className }: Props) => {
  return (
    <div className={cn("col-start-2 col-end-2 min-w-0 select-none", className)}>
      {children}
    </div>
  );
}

export const MainHeader = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-12 relative">
      <div className="flex items-center h-12 w-full ps-2">
        {children}
      </div>
    </div>
  );
}

export const MainTitle = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <div className="flex items-center h-full grow-[10] overflow-hidden -ms-1">
      <div className={cn("flex items-center h-8 px-2.5 py-1.5 max-w-[220px] text-tertiary text-xs whitespace-nowrap space-x-1.5", className)}>
        {children}
      </div>
    </div>
  );
}