import { BsTrash3 } from "react-icons/bs";
import { MoreHorizontalIcon } from "lucide-react";
import { Table } from "@tanstack/react-table";

interface Props<T> {
  table: Table<T>;
  onDelete?: () => void;
}

export const MenuBar = <T,>({ table, onDelete }: Props<T>) => {
  return (
    <div 
      data-select={(table.getIsAllRowsSelected() || table.getIsSomePageRowsSelected())}
      className="absolute -top-1 z-[999] data-[select=true]:block hidden w-fit data-[select=true]:opacity-100 opacity-0 transition-opacity"
    >
      <div className="w-fit select-none"> 
        <div className="inline-flex items-center justify-center rounded bg-background h-8 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08),0_0_0_1.25px_rgba(84,72,49,0.08)]">
          <button className="transition whitespace-nowrap h-full flex text-sm items-center text-marine px-2.5 rounded-s shadow-[1.25px_0_0_rgba(55,53,47,0.09)] hover:bg-primary/6">
            1 Selected
          </button>
          <button onClick={onDelete} className="transition whitespace-nowrap h-full flex text-sm items-center text-primary shadow-[1.25px_0_0_rgba(55,53,47,0.09)] hover:bg-primary/6 w-7 shrink-0 justify-center hover:text-destructive">
            <BsTrash3 className="size-4 block shrink-0 stroke-[0.2]" />
          </button>
          <button className="transition whitespace-nowrap h-full flex text-sm items-center rounded-e hover:bg-primary/6 w-7 shrink-0 justify-center text-primary">
            <MoreHorizontalIcon className="size-4 block shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
}