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

export const MeritSummaryTable = ({ kpis, form, competencyRecords, cultureRecords }: Props) => {
  return (
    <Table>
      <TableHeader className="border-y-[1.25px] border-[#CAD1DD] dark:border-[#3d587C]">
        <TableRow>
          <TableHead className="w-[20%] static bg-[#2383e224] border-[#CAD1DD] dark:border-[#3d587C] shadow-none">
            <div className="flex items-center h-full">
              <div className="text-xs font-normal text-secondary whitespace-nowrap overflow-hidden text-ellipsis">
                Subject
              </div>
            </div>
          </TableHead>
          <TableHead className="w-[10%] static bg-[#2383e224] border-[#CAD1DD] dark:border-[#3d587C] shadow-none">
            <div className="flex items-center h-full">
              <div className="text-xs font-normal text-secondary whitespace-nowrap overflow-hidden text-ellipsis">
                Full score (%)
              </div>
            </div>
          </TableHead>
          <TableHead className="w-[20%] static bg-[#2383e224] border-[#CAD1DD] dark:border-[#3d587C] shadow-none">
            <div className="flex items-center h-full">
              <div className="text-xs font-normal text-secondary whitespace-nowrap overflow-hidden text-ellipsis">
                Owner
              </div>
            </div>
          </TableHead>
          <TableHead className="w-[20%] static bg-[#2383e224] border-[#CAD1DD] dark:border-[#3d587C] shadow-none">
            <div className="flex items-center h-full">
              <div className="text-xs font-normal text-secondary whitespace-nowrap overflow-hidden text-ellipsis">
                Checker
              </div>
            </div>
          </TableHead>
          <TableHead className="w-[20%] border-none static bg-[#2383e224] shadow-none">
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
          <TableCell className="align-top px-3 h-7 dark:last:border-none last:shadow-none border-r-[1.25px] border-border">
            <div className="flex items-center h-full">
              <div className="leading-[1.5] whitespace-nowrap break-normal inline font-medium text-xs text-primary">
                KPI Achievement
              </div>
            </div>
          </TableCell>
          <TableCell className="align-top px-3 h-7 dark:last:border-none last:shadow-none border-r-[1.25px] border-border">
            <div className="flex items-center h-full justify-end">
              <div className="leading-[1.5] whitespace-nowrap break-normal text-end">
                <div className="leading-[1.5] text-nowrap [white-space-collapse:collapse] break-normal inline text-xs text-primary">
                  40.00
                </div>
              </div>
            </div>
          </TableCell>
          <TableCell className="align-top px-3 h-7 dark:last:border-none last:shadow-none border-r-[1.25px] border-border">
            <div className="flex items-center h-full justify-end">
              <div className="leading-[1.5] whitespace-nowrap break-normal text-end">
                <div className="leading-[1.5] text-nowrap [white-space-collapse:collapse] break-normal inline text-xs text-primary">
                  {(() => {
                    const sum = form.watch("kpis")?.reduce((acc, comp, idx) => {
                      const level = Number(comp.achievementOwner ?? 0);
                      const weight = convertAmountFromUnit(kpis[idx]?.weight ?? 0, 2);
                      
                      return acc + (level / 100) * weight;
                    }, 0) ?? 0;
                    
                    return ((40 * sum) / 50).toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    });
                  })()}
                </div>
              </div>
            </div>
          </TableCell>
          <TableCell className="align-top px-3 h-7 dark:last:border-none last:shadow-none border-r-[1.25px] border-border">
            <div className="flex items-center h-full justify-end">
              <div className="leading-[1.5] whitespace-nowrap break-normal text-end">
                <div className="leading-[1.5] text-nowrap [white-space-collapse:collapse] break-normal inline text-xs text-primary">
                  {(() => {
                    const sum = form.watch("kpis")?.reduce((acc, comp, idx) => {
                      const level = Number(comp.achievementChecker ?? 0);
                      const weight = convertAmountFromUnit(kpis[idx]?.weight ?? 0, 2);
                      
                      return acc + (level / 100) * weight;
                    }, 0) ?? 0;
                    
                    return ((40 * sum) / 50).toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    });
                  })()}
                </div>
              </div>
            </div>
          </TableCell>
          <TableCell className="aalign-top px-3 h-7 dark:last:border-none last:shadow-none">
            <div className="flex items-center h-full justify-end">
              <div className="leading-[1.5] whitespace-nowrap break-normal text-end">
                <div className="leading-[1.5] text-nowrap [white-space-collapse:collapse] break-normal inline text-xs text-primary">
                  {(() => {
                    const sum = form.watch("kpis")?.reduce((acc, comp, idx) => {
                      const level = Number(comp.achievementApprover ?? 0);
                      const weight = convertAmountFromUnit(kpis[idx]?.weight ?? 0, 2);
                      
                      return acc + (level / 100) * weight;
                    }, 0) ?? 0;
                    
                    return ((40 * sum) / 50).toLocaleString("en-US", {
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
          <TableCell className="align-top px-3 h-7 dark:last:border-none last:shadow-none border-r-[1.25px] border-border">
            <div className="flex items-center h-full">
              <div className="leading-[1.5] whitespace-nowrap break-normal inline font-medium text-xs text-primary">
                Competency
              </div>
            </div>
          </TableCell>
          <TableCell className="align-top px-3 h-7 dark:last:border-none last:shadow-none border-r-[1.25px] border-border">
            <div className="flex items-center h-full justify-end">
              <div className="leading-[1.5] whitespace-nowrap break-normal text-end">
                <div className="leading-[1.5] text-nowrap [white-space-collapse:collapse] break-normal inline text-xs text-primary">
                  30.00
                </div>
              </div>
            </div>
          </TableCell>
          <TableCell className="align-top px-3 h-7 dark:last:border-none last:shadow-none border-r-[1.25px] border-border">
            <div className="flex items-center h-full justify-end">
              <div className="leading-[1.5] whitespace-nowrap break-normal text-end">
                <div className="leading-[1.5] text-nowrap [white-space-collapse:collapse] break-normal inline text-xs text-primary">
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
          <TableCell className="align-top px-3 h-7 dark:last:border-none last:shadow-none border-r-[1.25px] border-border">
            <div className="flex items-center h-full justify-end">
              <div className="leading-[1.5] whitespace-nowrap break-normal text-end">
                <div className="leading-[1.5] text-nowrap [white-space-collapse:collapse] break-normal inline text-xs text-primary">
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
          <TableCell className="align-top px-3 h-7 dark:last:border-none last:shadow-none">
            <div className="flex items-center h-full justify-end">
              <div className="leading-[1.5] whitespace-nowrap break-normal text-end">
                <div className="leading-[1.5] text-nowrap [white-space-collapse:collapse] break-normal inline text-xs text-primary">
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
        <TableRow className="relative h-px">
          <TableCell className="align-top px-3 h-7 dark:last:border-none last:shadow-none border-r-[1.25px] border-border">
            <div className="flex items-center h-full">
              <div className="leading-[1.5] whitespace-nowrap break-normal inline font-medium text-xs text-primary">
                Culture
              </div>
            </div>
          </TableCell>
          <TableCell className="align-top px-3 h-7 dark:last:border-none last:shadow-none border-r-[1.25px] border-border">
            <div className="flex items-center h-full justify-end">
              <div className="leading-[1.5] whitespace-nowrap break-normal text-end">
                <div className="leading-[1.5] text-nowrap [white-space-collapse:collapse] break-normal inline text-xs text-primary">
                  30.00
                </div>
              </div>
            </div>
          </TableCell>
          <TableCell className="align-top px-3 h-7 dark:last:border-none last:shadow-none border-r-[1.25px] border-border">
            <div className="flex items-center h-full justify-end">
              <div className="leading-[1.5] whitespace-nowrap break-normal text-end">
                <div className="leading-[1.5] text-nowrap [white-space-collapse:collapse] break-normal inline text-xs text-primary">
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
          <TableCell className="align-top px-3 h-7 dark:last:border-none last:shadow-none border-r-[1.25px] border-border">
            <div className="flex items-center h-full justify-end">
              <div className="leading-[1.5] whitespace-nowrap break-normal text-end">
                <div className="leading-[1.5] text-nowrap [white-space-collapse:collapse] break-normal inline text-xs text-primary">
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
          <TableCell className="align-top px-3 h-7 dark:last:border-none last:shadow-none">
            <div className="flex items-center h-full justify-end">
              <div className="leading-[1.5] whitespace-nowrap break-normal text-end">
                <div className="leading-[1.5] text-nowrap [white-space-collapse:collapse] break-normal inline text-xs text-primary">
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
        <TableRow className="relative h-px !border-y-[1.25px] border-[#CAD1DD] dark:border-[#3d587C]">
          <TableCell colSpan={2} className="align-top px-3 h-7 dark:last:border-none last:shadow-none border-r-[1.25px] bg-[#2383e224] border-[#CAD1DD] dark:border-[#3d587C]">
            <div className="flex items-center h-full justify-end">
              <div className="leading-[1.5] whitespace-nowrap break-normal text-end">
                <div className="leading-[1.5] text-nowrap [white-space-collapse:collapse] break-normal inline text-xs text-primary">
                  100.00
                </div>
              </div>
            </div>
          </TableCell>
          <TableCell className="align-top px-3 h-7 dark:last:border-none last:shadow-none border-r-[1.25px] bg-[#2383e224] border-[#CAD1DD] dark:border-[#3d587C]">
            <div className="flex items-center h-full justify-end">
              <div className="leading-[1.5] whitespace-nowrap break-normal text-end">
                <div className="leading-[1.5] text-nowrap [white-space-collapse:collapse] break-normal inline text-xs text-primary">
                  {(() => {
                    const kpiOwner = form.watch("kpis")?.reduce((acc, comp, idx) => {
                      const level = Number(comp.achievementOwner ?? 0);
                      const weight = convertAmountFromUnit(kpis[idx]?.weight ?? 0, 2);
                      return acc + ((level / 100) * weight);
                    }, 0) ?? 0;
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

                    const sum = (40 * kpiOwner / 50) + compOwner + cultOwner;
                    return sum.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                  })()}
                </div>
              </div>
            </div>
          </TableCell>
          <TableCell className="align-top px-3 h-7 dark:last:border-none last:shadow-none border-r-[1.25px] bg-[#2383e224] border-[#CAD1DD] dark:border-[#3d587C]">
            <div className="flex items-center h-full justify-end">
              <div className="leading-[1.5] whitespace-nowrap break-normal text-end">
                <div className="leading-[1.5] text-nowrap [white-space-collapse:collapse] break-normal inline text-xs text-primary">
                  {(() => {
                    const kpiOwner = form.watch("kpis")?.reduce((acc, comp, idx) => {
                      const level = Number(comp.achievementChecker ?? 0);
                      const weight = convertAmountFromUnit(kpis[idx]?.weight ?? 0, 2);
                      return acc + ((level / 100) * weight);
                    }, 0) ?? 0;
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

                    const sum = ((40 * kpiOwner) / 50) + compOwner + cultOwner;
                    return sum.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                  })()}
                </div>
              </div>
            </div>
          </TableCell>
          <TableCell className="align-top px-3 h-7 dark:last:border-none last:shadow-none bg-[#2383e224] border-[#CAD1DD] dark:border-[#3d587C]">
            <div className="flex items-center h-full justify-end">
              <div className="leading-[1.5] whitespace-nowrap break-normal text-end">
                <div className="leading-[1.5] text-nowrap [white-space-collapse:collapse] break-normal inline text-xs text-primary">
                  {(() => {
                    const kpiOwner = form.watch("kpis")?.reduce((acc, comp, idx) => {
                      const level = Number(comp.achievementApprover ?? 0);
                      const weight = convertAmountFromUnit(kpis[idx]?.weight ?? 0, 2);
                      return acc + ((level / 100) * weight);
                    }, 0) ?? 0;
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

                    const sum = ((40 * kpiOwner) / 50) + compOwner + cultOwner;
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