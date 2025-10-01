import { BsTrash3 } from "react-icons/bs";
import { RowData, Table } from "@tanstack/react-table";
import { useConfirm } from "@/hooks/use-confirm";

interface Props<TData extends RowData> {
  table: Table<TData>;
  title: string;
  canPerform: boolean;
  onDelete: () => void;
}

export const MenuBar = <TData extends RowData>({ 
  table,
  title,
  canPerform,
  onDelete 
}: Props<TData>) => {
  const [ConfirmationDialog, confirm] = useConfirm({
    title,
  });

  const countSelected = table.getSelectedRowModel().rows.length;

  const handleDelete = async () => {
    const ok = await confirm();

    if (ok) {
      onDelete();
    }
  }

  return (
    <section data-select={countSelected > 0} className="sticky -top-0.5 start-16 z-999 w-fit hidden data-[select=true]:block">
      <ConfirmationDialog />
      <div className="absolute top-1">
        <div className="inline-flex shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08),0_0_0_1px_rgba(84,72,49,0.08)] dark:shadow-[0_0_0_1px_rgb(48,48,46),0_4px_12px_-2px_rgba(0,0,0,0.16)] rounded justify-center items-center h-8 bg-background">
          <div 
            role="button" 
            data-perform={canPerform}
            onClick={() => table.toggleAllRowsSelected(false)}
            className="transition text-marine text-sm whitespace-nowrap h-full items-center flex px-2.5 hover:bg-primary/6 data-[perform=true]:shadow-[1px_0_0_rgba(55,53,47,0.09)] dark:data-[perform=true]:shadow-[1px_0_0_rgba(255,255,255,0.094)] rounded rounded-r-none"
          >
            {countSelected} Selected
          </div>
          <div 
            role="button" 
            onClick={handleDelete}
            data-perform={canPerform}
            className="transition text-sm whitespace-nowrap h-full items-center hidden w-7 hover:bg-primary/6 justify-center text-primary hover:text-destructive data-[perform=true]:flex"
          >
            <BsTrash3 className="size-4 stroke-[0.2]" />
          </div>
        </div>
      </div>
    </section>
  );
}