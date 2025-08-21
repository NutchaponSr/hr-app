import { Column } from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { CalculationType, COUNT_OPTIONS, getCalculationValue, MORE_OPTIONS, PERCENT_OPTIONS, calculateColumnStats, ALL_CALCULATION_OPTIONS } from "@/types/caluculation";

interface Props<T> {
  column: Column<T>;
  children?: React.ReactNode;
}

export const Calculation = <T,>({ column }: Props<T>) => {
  const variant = column.columnDef.meta?.variant;
  const caluculateType = column.columnDef.meta?.calculateType;

  const [isOpen, setOpen] = useState(false);
  const [selectedCalculation, setSelectedCalculation] = useState<CalculationType | null>(caluculateType ? caluculateType : null);

  const columnStats = calculateColumnStats(column.getFacetedRowModel().rows.map(row => row.getValue(column.id)));

  const displayValue = selectedCalculation
    ? getCalculationValue(columnStats, selectedCalculation)
    : "Calculate";

  const currentType = ALL_CALCULATION_OPTIONS.find((f) => f.value === selectedCalculation);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button data-open={isOpen} className="flex justify-end items-center w-full px-2 hover:bg-primary/6 h-8 data-[open=true]:bg-primary/6 group/footer">
          <div 
            data-select={!!selectedCalculation} 
            className="flex items-center group-hover/footer:opacity-100 opacity-0 transition-opacity data-[select=true]:opacity-100"
          >
            <span className="font-medium text-[10px] text-foreground uppercase tracking-wide me-1 select-none">
              {currentType?.label}
            </span>
            <span data-select={!!selectedCalculation} className="text-tertiary h-full  data-[select=false]:text-foreground">
              {displayValue}
            </span>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => setSelectedCalculation(null)}>
            None
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Count</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent sideOffset={6} alignOffset={-4}>
                {COUNT_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setSelectedCalculation(option.value)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Percent</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent sideOffset={6} alignOffset={-4}>
                {PERCENT_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setSelectedCalculation(option.value)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          {variant === "numeric" && (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent sideOffset={6} alignOffset={-4}>
                  {MORE_OPTIONS.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setSelectedCalculation(option.value)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}