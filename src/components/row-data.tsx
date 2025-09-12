import { Hint } from "./hint";

interface Props {
  label: string;
  children: React.ReactNode;
}

export const RowData = ({ label, children }: Props) => {
  return (
    <div role="row" className="flex w-full relative">
      <div className="flex flex-row items-center self-start">
        <div className="flex items-center text-tertiary w-48 max-w-60 min-w-0">
          <Hint label={label} side="left">
            <div role="cell" className="select-none transition flex items-center h-full min-h-8 w-full rounded hover:bg-primary/6 max-w-full px-1.5">
              <div className="flex items-center leading-5 text-sm min-w-0">
                <div className="whitespace-break-spaces overflow-hidden text-ellipsis break-all">
                  {label}
                </div>
              </div>
            </div>
          </Hint>
        </div>
      </div>

      <div role="cell" className="flex h-full grow shrink basis-auto min-w-0 ms-1">
        <div
          role="button"
          className="select-none transition relative text-sm overflow-hidden rounded w-full min-h-8 px-2 py-1 flex items-center hover:bg-primary/6"
        >
          <div className="leading-5 break-all whitespace-pre-wrap text-primary">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}