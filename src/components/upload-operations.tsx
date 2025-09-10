import { useRef } from "react";
import { Command } from "cmdk";
import { BsFileRuled } from "react-icons/bs";
import { ChevronsUpDownIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { useUploadConfig } from "@/hooks/use-upload";

import { 
  Database, 
  IMPORT_METHOD_OPTIONS, 
  ImportMethod 
} from "@/types/upload";
import { databases } from "@/constants";

import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";

import { DatabaseItem } from "@/components/database-item";
import { CommandSearch } from "@/components/command-search";
import { RadioCardOption } from "@/components/radio-card-option";

interface UploadOperationsProps {
  type?: Database | null;
  file: File | null;
  canProceed: boolean;
  onSubmit: () => Promise<void>;
  onRemove: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const UploadOperations = ({ 
  type, 
  file,
  canProceed,
  onRemove,
  onSubmit,
  onChange 
}: UploadOperationsProps) => {
  const {
    selectedDatabase,
    importMethod,
    setImportMethod,
    setSelectedDatabase
  } = useUploadConfig();

  const fileRef = useRef<HTMLInputElement>(null);

  const handleMethodChange = (value: ImportMethod) => {
    setImportMethod(value);
  };

  const handleDatabaseSelect = (databaseKey: Database) => {
    setSelectedDatabase(databaseKey);
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove();
  }

  return (
    <>
      <div className="flex flex-col grow shrink basis-[0%] overflow-auto min-h-0 pt-[52px] pb-4 gap-6 w-full">
        <div className="flex flex-col w-[87%] justify-start gap-2 mx-6 shrink-0">
          <h1 className="text-primary text-[26px] leading-9 font-semibold tracking-wide">
            Import CSV
          </h1>
          <p className="text-tertiary text-sm leading-5 font-normal self-stretch">
            Create a new database with your CSV or merge it into an existing one
          </p>
        </div>
        <div className="flex flex-col w-[87%] mx-6">
          <h5 className="text-xs leading-5 text-tertiary whitespace-nowrap overflow-hidden text-ellipsis font-normal mb-1.5">
            Upload CSV
          </h5>
          <input 
            type="file"
            accept=".xlsx,.xls,.csv"
            ref={fileRef}
            className="sr-only"
            onChange={onChange}
          />
          <Button variant="secondary" onClick={() => fileRef.current?.click()} className={cn(file && "justify-between px-2")}>
            {file ? (
              <>
                <div className="flex items-center gap-2 grow shrink basis-0 min-w-0">
                  <BsFileRuled className="size-4 shrink-0 stroke-[0.25]" />
                  <span className="text-ellipsis overflow-hidden whitespace-nowrap">
                    {file.name.split(".")[0]}
                  </span>
                </div>
                <div 
                  role="button" 
                  className="rounded p-1 flex items-center justify-center transition outline-none bg-transparent hover:bg-[#0000001a]"
                  onClick={handleRemoveFile}
                >
                  <XIcon />
                </div>
              </>
            ) : (
              "Choose file"
            )}
          </Button>
        </div>

        <div className="flex flex-col w-[87%] mx-6">
          <h5 className="text-xs leading-5 text-tertiary whitespace-nowrap overflow-hidden text-ellipsis font-normal mb-1.5">
            Import method
          </h5>

          <RadioGroup className="gap-2" value={importMethod} onValueChange={handleMethodChange}>
            {IMPORT_METHOD_OPTIONS.map((option) => (
              <RadioCardOption
                key={option.key}
                value={option.key}
                id={option.key}
                icon={option.icon}
                label={option.label}
                description={option.description}
              />
            ))}
          </RadioGroup>
        </div>

        {type && (
          <div className="flex flex-col w-[87%] mx-6">
            <h5 className="text-xs leading-5 text-tertiary whitespace-nowrap overflow-hidden text-ellipsis font-normal mb-1.5">
              Import Location
            </h5>
            <Popover modal>
              <PopoverTrigger asChild>
                <Button variant="outline" size="md" className="justify-between text-tertiary">
                  {selectedDatabase ? (
                    <div className="flex items-center gap-2 grow shrink basis-0 overflow-hidden">
                      {(() => {
                        const IconComponent = databases[selectedDatabase].icon;
                        return <IconComponent className="size-4 text-marine" />;
                      })()}
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap text-primary">
                        {databases[selectedDatabase].title}
                      </span>
                    </div>
                  ) : (
                    "Select database"
                  )}
                  <ChevronsUpDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[318px] p-2">
                <CommandSearch placeholder="Search database...">
                  <Command.Group className="flex flex-col gap-px">
                    {Object.entries(databases).map(([key, database]) => (
                      <DatabaseItem
                        key={key}
                        databaseKey={key}
                        database={database}
                        onSelect={() => handleDatabaseSelect(key as Database)}
                        isActive={selectedDatabase === key}
                      />
                    ))}
                  </Command.Group>
                </CommandSearch>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-center gap-2 w-[87%] mx-6 pt-4 pb-6 shrink-0">
        <Button 
          size="md" 
          variant="primary" 
          onClick={onSubmit} 
          disabled={!canProceed}
        >
          Map CSV headers
        </Button>
      </div>
    </>
  );
}