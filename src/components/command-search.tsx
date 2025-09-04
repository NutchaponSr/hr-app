import { Command } from "cmdk";

interface Props {
  children: React.ReactNode;
  placeholder?: string;
}

export const CommandSearch = ({ children, placeholder }: Props) => {
  return (
    <Command className="flex flex-col gap-2">
      <Command.Input 
        autoFocus
        placeholder={placeholder}
        className="focus-visible:border-marine focus-visible:ring-marine/40 focus-visible:ring-[2.5px] focus-visible:outline-none rounded px-2.5 w-full shadow-[0_0_0_1.25px_rgba(15,15,15,0.1)] bg-[#f2f1ee99] dark:shadow-[0_0_0_1.25px_rgba(255,255,255,0.075)] dark:bg-accent text-sm relative leading-5 flex items-center h-7 py-0.5 text-primary placeholder:text-foreground"
      />
      <Command.List>
        {children}
        <Command.Empty className="flex flex-col gap-2 p-2">
          <div className="mx-1 text-xs text-tertiary font-medium">
            Not found
          </div>
        </Command.Empty>
      </Command.List>
    </Command>
  );
}