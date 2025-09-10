interface Props {
  header: string;
  children: React.ReactNode;
}

export const ColumnData = ({
  children,
  header
}: Props) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <div className="flex items-center text-tertiary h-6 w-min max-w-full min-w-0">
          <div role="cell" className="select-none transition flex items-center h-full w-full rounded px-1.5 max-w-full hover:bg-primary/6">
            <div className="flex items-center leading-4.5 min-w-0 text-xs font-medium">
              <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                {header}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div role="button" className="select-none transition relative text-sm overflow-hidden rounded w-full min-h-7.5 px-2 py-1 flex items-center hover:bg-primary/6 text-primary">
        <div className="whitespace-break-spaces text-ellipsis break-all">
          {children}
        </div>
      </div>
    </div>
  );
}