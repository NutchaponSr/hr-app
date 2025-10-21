import { Content } from "@/components/content";
import { SelectionBadge } from "@/components/selection-badge";
import { convertAmountFromUnit } from "@/lib/utils";
import { kpiCategoies, projectTypes } from "../../constants";
import { KpiWithEvaluation } from "../../types";

interface KpiInfoDisplayProps {
  kpi: KpiWithEvaluation;
}

export const KpiInfoDisplay = ({ kpi }: KpiInfoDisplayProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="grid grid-cols-6 gap-2">
        <div className="col-span-2">
          <Content label="Category">
            <SelectionBadge label={kpiCategoies[kpi.category!]} />
          </Content>
        </div>
        <div className="col-span-3">
          <Content label="Name">
            <p className="text-sm text-primary whitespace-break-spaces [word-break:break-word] text-ellipsis text-4.5 overflow-hidden">
              {kpi.name}
            </p>
          </Content>
        </div>
        <div className="col-span-1 text-primary">
          <Content label="Weight">
            <p className="text-sm text-primary whitespace-break-spaces [word-break:break-word] text-ellipsis text-4.5 overflow-hidden">
              {convertAmountFromUnit(kpi.weight, 2).toLocaleString("en-US", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2
              })} %
            </p>
          </Content>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2">
          <Content label="Link to Strategy">
            <p className="text-primary whitespace-break-spaces [word-break:break-word] text-ellipsis text-4.5 overflow-hidden">
              {kpi.strategy}
            </p>
          </Content>
        </div>
        <div className="col-span-1">
          <Content label="Kpi's type">
            {kpi.type 
              ? <SelectionBadge label={projectTypes[kpi.type]} />
              : "-"
            }
          </Content>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Content label="Objective">
          <p className="text-sm text-primary whitespace-break-spaces [word-break:break-word] text-ellipsis text-4.5 overflow-hidden">
            {kpi.objective}
          </p>
        </Content>
        <Content label="Definition">
          <p className="text-sm text-primary whitespace-break-spaces [word-break:break-word] text-ellipsis text-4.5 overflow-hidden">
            {kpi.definition}
          </p>
        </Content>
      </div>
      <div className="relative after:absolute after:border-border after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t text-xs text-secondary uppercase text-center my-2">
        <span className="uppercase z-10 bg-background [[data-slot=table-row]:nth-child(even)_&]:bg-sidebar relative px-2">
          target
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Content label="Need Improve (<70%)">
          <p className="text-sm text-primary whitespace-break-spaces [word-break:break-word] text-ellipsis text-4.5 overflow-hidden">
            {kpi.target70}
          </p>
        </Content>
        <Content label="Level 2 (80%)">
          <p className="text-sm text-primary whitespace-break-spaces [word-break:break-word] text-ellipsis text-4.5 overflow-hidden">
            {kpi.target80}
          </p>
        </Content>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Content label="Level 3 (80%)">
          <p className="text-sm text-primary whitespace-break-spaces [word-break:break-word] text-ellipsis text-4.5 overflow-hidden">
            {kpi.target90}
          </p>
        </Content>
        <Content label="Meet expert (100%)">
          <p className="text-sm text-primary whitespace-break-spaces [word-break:break-word] text-ellipsis text-4.5 overflow-hidden">
            {kpi.target100}
          </p>
        </Content>
      </div>
    </div>
  );
};