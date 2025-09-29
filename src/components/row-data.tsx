import { IconType } from "react-icons";

interface Props {
  icon?: IconType;
  label: string;
  children: React.ReactNode;
}

export const RowData = ({
  label,
  icon: Icon,
  children
}: Props) => {
  return (
    <div role="row" className="flex w-full relative">
      <div className="flex flex-row items-center self-start">
        <div className="flex items-center text-tertiary h-8 w-28 max-w-28 min-w-0">
          <div role="cell" className="select-none transition hover:bg-primary/6 cursor-pointer flex items-center w-full h-full rounded px-1.5 max-w-full">
            <div className="flex items-center leading-4 min-w-0 text-sm font-normal">
              {Icon && <Icon className="size-3.5 me-1" />}
              <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                {label}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div role="cell" className="flex h-full flex-1 flex-col min-w-0 ms-1">
        <div className="relative text-sm overflow-hidden inline-block rounded w-full min-h-8 px-1.5 items-center">
          {children}
        </div>
      </div>
    </div>
  );
}