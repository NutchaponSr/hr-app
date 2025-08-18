import { 
  BsArrowDownUp, 
  BsFilterCircle 
} from "react-icons/bs";
import { ChevronDownIcon } from "lucide-react";

import { 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "@/components/ui/button";
interface Props {
  tabTriggers: {
    value: string;
    onChange: () => void;
  }[];
  onClick: () => void;
} 

export const Toolbar = ({ tabTriggers, onClick }: Props) => {
  return (
    <div className="min-h-9 px-24 sticky top-0 left-0 shrink-0 z-86">
      <div className="relative">
        <div className="flex items-center h-9 start-24 border-b-[1.25px] border-border">
          <TabsList role="tablist" className="flex items-center h-full grow-10 overflow-hidden -ms-1">
            <div className="flex items-center h-full">
              <div className="inline-flex h-full">
                {tabTriggers.map(({ value, onChange }, index) => (
                  <TabsTrigger 
                    key={index}
                    role="tab"
                    value={value}
                    onClick={onChange}
                  >
                    <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                      {value}
                    </span>
                  </TabsTrigger>
                ))}
              </div>
            </div>
          </TabsList>
          <div className="grow h-full">
            <div className="flex flex-row justify-end items-center h-full gap-0.5">
              <Button
                size="iconSm"
                variant="ghost"
              >
                <BsFilterCircle className="stroke-[0.25]" />
              </Button>
              <Button
                size="iconSm"
                variant="ghost"
              >
                <BsArrowDownUp className="stroke-[0.25]" />
              </Button>
              
              <div className="relative inline-flex shrink-0 rounded overflow-hidden h-7 ml-1">
                <button onClick={onClick} className="transition flex items-center justify-center whitespace-nowrap rounded-l px-2 font-medium bg-marine text-white text-sm hover:bg-marine-muted">
                  New
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="transition flex items-center justify-center whitespace-nowrap rounded-r bg-marine shadow-[inset_1px_0_0_rgba(55,53,47,0.16)] text-white text-sm w-6 hover:bg-marine-muted focus-visible:outline-none">
                      <ChevronDownIcon className="size-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">

                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}