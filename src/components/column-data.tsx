import { cn } from "@/lib/utils";
import { IconType } from "react-icons";

interface Props {
  icon?: IconType;
  header: string;
  isSelected?: boolean;
  children: React.ReactNode;
}

export const ColumnData = ({
  icon: Icon,
  children,
  isSelected,
  header
}: Props) => {
  return (
    <div className={cn("flex flex-col p-1 rounded", isSelected && "bg-[#0376ba0b]")}>
      <div className="flex flex-row">
        <div className="flex items-center text-tertiary h-6 w-min max-w-full min-w-0">
          <div role="cell" className="select-none transition flex items-center h-full w-full rounded px-1.5 max-w-full hover:bg-primary/6">
            <div className="flex items-center leading-4.5 min-w-0 text-xs font-medium">
              {Icon && <Icon className="size-3 me-1" />}
              <div className={cn("whitespace-nowrap overflow-hidden text-ellipsis", isSelected && "text-marine")}>
                {header}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div 
        role="button" 
        className={cn(
          "select-none transition relative text-sm overflow-hidden rounded w-full min-h-7.5 px-2 py-1 flex items-center hover:bg-primary/6 text-primary",
          isSelected && "bg-background shadow-[0_4px_12px_0_rgba(25,25,25,0.027),0_1px_2px_0_rgba(25,25,25,0.02),0_0_0_1px_rgba(0,111,200,0.09)] hover:bg-[#036fad0b]"
        )}
      >
        <div className="whitespace-break-spaces text-ellipsis break-all">
          {children}
        </div>
      </div>
    </div>
  );
}