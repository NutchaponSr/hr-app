import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { MeritEvaluationSchema } from "../../schema";
import { UseFormReturn } from "react-hook-form";
import { CompetencyWithInfo, CultureWithInfo } from "../../type";
import { convertAmountFromUnit } from "@/lib/utils";
import { KpiWithInfo } from "@/modules/bonus/types";

interface Props {
  form: UseFormReturn<MeritEvaluationSchema>;
  kpis: KpiWithInfo[];
  competencyRecords: CompetencyWithInfo[];
  cultureRecords: CultureWithInfo[];
}

export const MeritSummaryTable = ({ form, competencyRecords, cultureRecords }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead rowSpan={2} className="w-[20%] static">
            <div className="flex items-center h-full">
              <div className="text-xs font-normal text-secondary whitespace-nowrap overflow-hidden text-ellipsis">
                Subject
              </div>
            </div>
          </TableHead>
          <TableHead rowSpan={2} className="w-[10%] static">
            <div className="flex items-center h-full">
              <div className="text-xs font-normal text-secondary whitespace-nowrap overflow-hidden text-ellipsis">
                Full score (%)
              </div>
            </div>
          </TableHead>
          <TableHead colSpan={3} className="border-none static shadow-[inset_0_1.25px_0_rgba(42,28,0,0.07)] dark:shadow-[inset_0_1.25px_0_rgba(255,255,243,0.082)]">
            <div className="flex items-center h-full justify-center">
              <div className="text-xs font-normal text-secondary whitespace-nowrap overflow-hidden text-ellipsis">
                Evaluation results (%)
              </div>
            </div>
          </TableHead>
        </TableRow>
        <TableRow>
          <TableHead className="static">
            <div className="flex items-center h-full">
              <div className="text-xs font-normal text-secondary whitespace-nowrap overflow-hidden text-ellipsis">
                Owner
              </div>
            </div>
          </TableHead>
          <TableHead className="static">
            <div className="flex items-center h-full">
              <div className="text-xs font-normal text-secondary whitespace-nowrap overflow-hidden text-ellipsis">
                Checker
              </div>
            </div>
          </TableHead>
          <TableHead className="border-none static">
            <div className="flex items-center h-full">
              <div className="text-xs font-normal text-secondary whitespace-nowrap overflow-hidden text-ellipsis">
                Approver
              </div>
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="relative h-px !border-b-[1.25px] border-border">
          <TableCell className="align-top px-3 h-8 dark:last:border-none last:shadow-none border-r-[1.25px] border-border">
            <div className="flex items-center h-full">
              <div className="leading-[1.5] whitespace-nowrap break-normal inline font-medium text-sm text-primary">
                KPI Achievement
              </div>
            </div>
          </TableCell>
          <TableCell className="align-top px-3 h-8 dark:last:border-none last:shadow-none border-r-[1.25px] border-border">
            <div className="flex items-center h-full justify-end">
              <div className="leading-[1.5] whitespace-nowrap break-normal text-end">
                <div className="leading-[1.5] text-nowrap [white-space-collapse:collapse] break-normal inline text-sm text-primary">
                  40.00
                </div>
              </div>
            </div>
          </TableCell>
          <TableCell className="align-top px-3 h-8 dark:last:border-none last:shadow-none border-r-[1.25px] border-border">
            <div className="flex items-center h-full justify-end">
              <div className="leading-[1.5] whitespace-nowrap break-normal text-end">
                <div className="leading-[1.5] text-nowrap [white-space-collapse:collapse] break-normal inline text-sm text-primary">
                  TODO
                </div>
              </div>
            </div>
          </TableCell>
          <TableCell className="align-top px-3 h-8 dark:last:border-none last:shadow-none border-r-[1.25px] border-border">
            <div className="flex items-center h-full justify-end">
              <div className="leading-[1.5] whitespace-nowrap break-normal text-end">
                <div className="leading-[1.5] text-nowrap [white-space-collapse:collapse] break-normal inline text-sm text-primary">
                  TODO
                </div>
              </div>
            </div>
          </TableCell>
          <TableCell className="aalign-top px-3 h-8 dark:last:border-none last:shadow-none">
            <div className="flex items-center h-full justify-end">
              <div className="leading-[1.5] whitespace-nowrap break-normal text-end">
                <div className="leading-[1.5] text-nowrap [white-space-collapse:collapse] break-normal inline text-sm text-primary">
                  TODO
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
        <TableRow className="relative h-px !border-b-[1.25px] border-border">
          <TableCell className="align-top px-3 h-8 dark:last:border-none last:shadow-none border-r-[1.25px] border-border">
            <div className="flex items-center h-full">
              <div className="leading-[1.5] whitespace-nowrap break-normal inline font-medium text-sm text-primary">
                Competency
              </div>
            </div>
          </TableCell>
          <TableCell className="align-top px-3 h-8 dark:last:border-none last:shadow-none border-r-[1.25px] border-border">
            <div className="flex items-center h-full justify-end">
              <div className="leading-[1.5] whitespace-nowrap break-normal text-end">
                <div className="leading-[1.5] text-nowrap [white-space-collapse:collapse] break-normal inline text-sm text-primary">
                  30.00
                </div>
              </div>
            </div>
          </TableCell>
          <TableCell className="align-top px-3 h-8 dark:last:border-none last:shadow-none border-r-[1.25px] border-border">
            <div className="flex items-center h-full justify-end">
              <div className="leading-[1.5] whitespace-nowrap break-normal text-end">
                <div className="leading-[1.5] text-nowrap [white-space-collapse:collapse] break-normal inline text-sm text-primary">
                  {(() => {
                    const sum = form.watch('competencies')?.reduce((acc, comp, idx) => {
                      const level = Number(comp.levelOwner ?? 0);
                      const weight = convertAmountFromUnit(competencyRecords[idx]?.weight ?? 0, 2);
                      
                      return acc + ((level / competencyRecords.length) * weight);
                    }, 0) ?? 0;
                    
                    return sum.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    });
                  })()}
                </div>
              </div>
            </div>
          </TableCell>
          <TableCell className="align-top px-3 h-8 dark:last:border-none last:shadow-none border-r-[1.25px] border-border">
            <div className="flex items-center h-full justify-end">
              <div className="leading-[1.5] whitespace-nowrap break-normal text-end">
                <div className="leading-[1.5] text-nowrap [white-space-collapse:collapse] break-normal inline text-sm text-primary">
                  {(() => {
                    const sum = form.watch('competencies')?.reduce((acc, comp, idx) => {
                      const level = Number(comp.levelChecker ?? 0);
                      const weight = convertAmountFromUnit(competencyRecords[idx]?.weight ?? 0, 2);
                      
                      return acc + ((level / competencyRecords.length) * weight);
                    }, 0) ?? 0;
                    
                    return sum.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    });
                  })()}
                </div>
              </div>
            </div>
          </TableCell>
          <TableCell className="align-top px-3 h-8 dark:last:border-none last:shadow-none">
            <div className="flex items-center h-full justify-end">
              <div className="leading-[1.5] whitespace-nowrap break-normal text-end">
                <div className="leading-[1.5] text-nowrap [white-space-collapse:collapse] break-normal inline text-sm text-primary">
                  {(() => {
                    const sum = form.watch('competencies')?.reduce((acc, comp, idx) => {
                      const level = Number(comp.levelApprover ?? 0);
                      const weight = convertAmountFromUnit(competencyRecords[idx]?.weight ?? 0, 2);
                      
                      return acc + ((level / competencyRecords.length) * weight);
                    }, 0) ?? 0;
                    
                    return sum.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    });
                  })()}
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
        <TableRow className="relative h-px !border-b-[1.25px] border-border">
          <TableCell className="align-top px-3 h-8 dark:last:border-none last:shadow-none border-r-[1.25px] border-border">
            <div className="flex items-center h-full">
              <div className="leading-[1.5] whitespace-nowrap break-normal inline font-medium text-sm text-primary">
                Culture
              </div>
            </div>
          </TableCell>
          <TableCell className="align-top px-3 h-8 dark:last:border-none last:shadow-none border-r-[1.25px] border-border">
            <div className="flex items-center h-full justify-end">
              <div className="leading-[1.5] whitespace-nowrap break-normal text-end">
                <div className="leading-[1.5] text-nowrap [white-space-collapse:collapse] break-normal inline text-sm text-primary">
                  30.00
                </div>
              </div>
            </div>
          </TableCell>
          <TableCell className="align-top px-3 h-8 dark:last:border-none last:shadow-none border-r-[1.25px] border-border">
            <div className="flex items-center h-full justify-end">
              <div className="leading-[1.5] whitespace-nowrap break-normal text-end">
                <div className="leading-[1.5] text-nowrap [white-space-collapse:collapse] break-normal inline text-sm text-primary">
                  {(() => {
                    const sum = form.watch("cultures")?.reduce((acc, comp, idx) => {
                      const level = Number(comp.levelBehaviorOwner ?? 0);
                      const weight = convertAmountFromUnit(cultureRecords[idx]?.weight ?? 0, 2);
                      
                      return acc + ((level / cultureRecords.length) * weight);
                    }, 0) ?? 0;
                    
                    return sum.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    });
                  })()}
                </div>
              </div>
            </div>
          </TableCell>
          <TableCell className="align-top px-3 h-8 dark:last:border-none last:shadow-none border-r-[1.25px] border-border">
            <div className="flex items-center h-full justify-end">
              <div className="leading-[1.5] whitespace-nowrap break-normal text-end">
                <div className="leading-[1.5] text-nowrap [white-space-collapse:collapse] break-normal inline text-sm text-primary">
                  {(() => {
                    const sum = form.watch("cultures")?.reduce((acc, comp, idx) => {
                      const level = Number(comp.levelBehaviorChecker ?? 0);
                      const weight = convertAmountFromUnit(cultureRecords[idx]?.weight ?? 0, 2);
                      
                      return acc + ((level / cultureRecords.length) * weight);
                    }, 0) ?? 0;
                    
                    return sum.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    });
                  })()}
                </div>
              </div>
            </div>
          </TableCell>
          <TableCell className="align-top px-3 h-8 dark:last:border-none last:shadow-none">
            <div className="flex items-center h-full justify-end">
              <div className="leading-[1.5] whitespace-nowrap break-normal text-end">
                <div className="leading-[1.5] text-nowrap [white-space-collapse:collapse] break-normal inline text-sm text-primary">
                  {(() => {
                    const sum = form.watch("cultures")?.reduce((acc, comp, idx) => {
                      const level = Number(comp.levelBehaviorApprover ?? 0);
                      const weight = convertAmountFromUnit(cultureRecords[idx]?.weight ?? 0, 2);
                      
                      return acc + ((level / cultureRecords.length) * weight);
                    }, 0) ?? 0;
                    
                    return sum.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    });
                  })()}
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
        <TableRow className="relative h-px !border-b-[1.25px] border-border">
          <TableCell colSpan={2} className="align-top px-3 h-8 dark:last:border-none last:shadow-none border-r-[1.25px] border-border">
            <div className="flex items-center h-full justify-end">
              <div className="leading-[1.5] whitespace-nowrap break-normal text-end">
                <div className="leading-[1.5] text-nowrap [white-space-collapse:collapse] break-normal inline text-sm text-primary">
                  100.00
                </div>
              </div>
            </div>
          </TableCell>
          <TableCell className="align-top px-3 h-8 dark:last:border-none last:shadow-none border-r-[1.25px] border-border">
            <div className="flex items-center h-full justify-end">
              <div className="leading-[1.5] whitespace-nowrap break-normal text-end">
                <div className="leading-[1.5] text-nowrap [white-space-collapse:collapse] break-normal inline text-sm text-primary">
                  {(() => {
                    const kpiOwner = 0; // replace TODO once KPI logic is ready
                    const compOwner = form.watch("competencies")?.reduce((acc, comp, idx) => {
                      const level = Number(comp.levelOwner ?? 0);
                      const weight = convertAmountFromUnit(competencyRecords[idx]?.weight ?? 0, 2);
                      return acc + ((level / competencyRecords.length) * weight);
                    }, 0) ?? 0;
                    const cultOwner = form.watch("cultures")?.reduce((acc, comp, idx) => {
                      const level = Number(comp.levelBehaviorOwner ?? 0);
                      const weight = convertAmountFromUnit(cultureRecords[idx]?.weight ?? 0, 2);
                      return acc + ((level / cultureRecords.length) * weight);
                    }, 0) ?? 0;

                    const sum = kpiOwner + compOwner + cultOwner;
                    return sum.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                  })()}
                </div>
              </div>
            </div>
          </TableCell>
          <TableCell className="align-top px-3 h-8 dark:last:border-none last:shadow-none border-r-[1.25px] border-border">
            <div className="flex items-center h-full justify-end">
              <div className="leading-[1.5] whitespace-nowrap break-normal text-end">
                <div className="leading-[1.5] text-nowrap [white-space-collapse:collapse] break-normal inline text-sm text-primary">
                  {(() => {
                    const kpiOwner = 0; // replace TODO once KPI logic is ready
                    const compOwner = form.watch("competencies")?.reduce((acc, comp, idx) => {
                      const level = Number(comp.levelChecker ?? 0);
                      const weight = convertAmountFromUnit(competencyRecords[idx]?.weight ?? 0, 2);
                      return acc + ((level / competencyRecords.length) * weight);
                    }, 0) ?? 0;
                    const cultOwner = form.watch("cultures")?.reduce((acc, comp, idx) => {
                      const level = Number(comp.levelBehaviorChecker ?? 0);
                      const weight = convertAmountFromUnit(cultureRecords[idx]?.weight ?? 0, 2);
                      return acc + ((level / cultureRecords.length) * weight);
                    }, 0) ?? 0;

                    const sum = kpiOwner + compOwner + cultOwner;
                    return sum.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                  })()}
                </div>
              </div>
            </div>
          </TableCell>
          <TableCell className="align-top px-3 h-8 dark:last:border-none last:shadow-none border-r-[1.25px] border-border">
            <div className="flex items-center h-full justify-end">
              <div className="leading-[1.5] whitespace-nowrap break-normal text-end">
                <div className="leading-[1.5] text-nowrap [white-space-collapse:collapse] break-normal inline text-sm text-primary">
                  {(() => {
                    const kpiOwner = 0; // replace TODO once KPI logic is ready
                    const compOwner = form.watch("competencies")?.reduce((acc, comp, idx) => {
                      const level = Number(comp.levelApprover ?? 0);
                      const weight = convertAmountFromUnit(competencyRecords[idx]?.weight ?? 0, 2);
                      return acc + ((level / competencyRecords.length) * weight);
                    }, 0) ?? 0;
                    const cultOwner = form.watch("cultures")?.reduce((acc, comp, idx) => {
                      const level = Number(comp.levelBehaviorApprover ?? 0);
                      const weight = convertAmountFromUnit(cultureRecords[idx]?.weight ?? 0, 2);
                      return acc + ((level / cultureRecords.length) * weight);
                    }, 0) ?? 0;

                    const sum = kpiOwner + compOwner + cultOwner;
                    return sum.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                  })()}
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}