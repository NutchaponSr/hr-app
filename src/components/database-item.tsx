import { Command } from "cmdk";
import { IconType } from "react-icons";
import { HiCheck } from "react-icons/hi";

interface DatabaseItemProps {
  databaseKey: string;
  database: {
    title: string;
    description: string;
    icon: IconType;
  };
  onSelect?: () => void;
  isActive?: boolean;
}

export const DatabaseItem = ({ databaseKey, database, onSelect, isActive = false }: DatabaseItemProps) => {
  return (
    <Command.Item key={databaseKey} className="w-full flex rounded hover:bg-primary/6" onSelect={onSelect}>
      <div className="flex items-center gap-2 leading-[120%] w-full select-none min-h-11 text-sm px-2 py-1">
        <div className="flex items-center justify-center min-w-5 min-h-5 mt-px self-start">
          <div className="flex items-center justify-center w-5 h-5 shrink-0">
            <database.icon className="size-5 text-marine" />
          </div>
        </div>
        <div className="grow shrink basis-auto min-w-0 mx-0">
          <div className="whitespace-nowrap overflow-hidden text-ellipsis">
            <div className="flex flex-row items-center">
              <div className="whitespace-nowrap overflow-hidden text-ellipsis text-primary">
                {database.title}
              </div>
            </div>
          </div>
          <div className="whitespace-nowrap overflow-hidden text-ellipsis">
            <div className="flex flex-row items-center">
              <div className="whitespace-nowrap overflow-hidden text-ellipsis text-muted text-xs">
                {database.description}
              </div>
            </div>
          </div>
        </div>
        {isActive && (
          <div className="ml-auto min-w-0 shrink-0">
            <HiCheck className="text-primary size-4" />
          </div>
        )}
      </div>
    </Command.Item>
  );
};
