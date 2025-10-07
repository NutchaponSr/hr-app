import { useEffect, useRef } from "react";
import { CompetencyWithInfo } from "../../type";
import { Row, Table } from "@tanstack/react-table";

export const PlanTargetCell = ({ 
  row, 
  table 
}: { 
  row: Row<CompetencyWithInfo>, 
  table: Table<CompetencyWithInfo> 
}) => {
  const inputRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateHeights = () => {
      if (inputRef.current && outputRef.current) {
        const heights = {
          input: inputRef.current.offsetHeight,
          output: outputRef.current.offsetHeight
        };
        
        if (!table.options.meta) {
          table.options.meta = {};
        }
        if (!table.options.meta.rowHeights) {
          table.options.meta.rowHeights = {};
        }
        table.options.meta.rowHeights[row.id] = heights;
      }
    };

    updateHeights();

    window.addEventListener('resize', updateHeights);
    return () => window.removeEventListener('resize', updateHeights);
  }, [row.original.input, row.original.output, row.id, table]);

  return (
    <div className="flex flex-col gap-2">
      {/* Input */}
      <div ref={inputRef} className="flex flex-col gap-0.5">
        <h5 className="text-xs font-medium text-secondary"> 
          สิ่งที่ต้องทำได้ (แสดงความเชี่ยวชาญ/ความสามารถ) 
        </h5>
        <p className="text-xs text-primary whitespace-break-spaces">
          {row.original.input}
        </p>
      </div>
      {/* Output */}
      <div ref={outputRef} className="flex flex-col gap-0.5">
        <h5 className="text-xs font-medium text-secondary"> 
          ผลลัพธ์ที่ต้องทำให้สำเร็จ
        </h5>
        <p className="text-xs text-primary whitespace-break-spaces">
          {row.original.output}
        </p>
      </div>
    </div>
  );
};