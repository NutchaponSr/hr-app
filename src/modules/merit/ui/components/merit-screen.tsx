import { GoProject } from "react-icons/go";

interface Props {
  year: number;
}

export const MeritScreen = ({ }: Props) => {
  return (
    <article className="relative col-span-1">
      <div className="min-h-12 relative">
        <div className="flex items-center h-12 w-full ps-2">
          <div className="flex items-center h-full grow-[10] overflow-hidden -ms-1">
            <div className="flex items-center h-8 px-2.5 py-1.5 max-w-[220px] text-tertiary text-xs whitespace-nowrap space-x-1.5">
              <GoProject className="size-3 shrink-0 stroke-[0.5]" />
              <span className="whitespace-nowrap text-ellipsis overflow-hidden font-medium">
                KPI Merit
              </span>
            </div>
          </div>
        </div>
      </div>

      
    </article>
  );
}