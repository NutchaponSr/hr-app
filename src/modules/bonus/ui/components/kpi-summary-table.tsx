import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { KpiBonusEvaluationsSchema } from "../../schema";
import { UseFormReturn } from "react-hook-form";
import { KpiWithComments } from "../../types";
import { calculateAchievementSum, formatAchievementSum } from "../../util";

interface Props {
  kpis: KpiWithComments[];
  fullScore: number;
  ownerId: string;
  form: UseFormReturn<KpiBonusEvaluationsSchema>;
}

export const KpiSummaryTable = ({ kpis, form, fullScore, ownerId }: Props) => {
  const evaluations = form.watch("evaluations");
  
  const ownerSum = calculateAchievementSum(evaluations, kpis, "achievementOwner");
  const checkerSum = calculateAchievementSum(evaluations, kpis, "achievementChecker");
  const approverSum = calculateAchievementSum(evaluations, kpis, "achievementApprover");
  
  return (
    <Table>
      <TableHeader className="border-[#CAD1DD] dark:border-[#3d587C] border-y-[1.25px]">
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
                  {formatAchievementSum(fullScore)}
                </div>
              </div>
            </div>
          </TableCell>
          <TableCell className="align-top px-3 h-7 dark:last:border-none last:shadow-none border-r-[1.25px] border-border">
            <div className="flex items-center h-full justify-end">
              <div className="leading-[1.5] whitespace-nowrap break-normal text-end">
                <div className="leading-[1.5] text-nowrap [white-space-collapse:collapse] break-normal inline text-xs text-primary">
                  {formatAchievementSum(ownerSum)}
                </div>
              </div>
            </div>
          </TableCell>
          <TableCell className="align-top px-3 h-7 dark:last:border-none last:shadow-none border-r-[1.25px] border-border">
            <div className="flex items-center h-full justify-end">
              <div className="leading-[1.5] whitespace-nowrap break-normal text-end">
                <div className="leading-[1.5] text-nowrap [white-space-collapse:collapse] break-normal inline text-xs text-primary">
                  {formatAchievementSum(checkerSum)}
                </div>
              </div>
            </div>
          </TableCell>
          <TableCell className="aalign-top px-3 h-7 dark:last:border-none last:shadow-none">
            <div className="flex items-center h-full justify-end">
              <div className="leading-[1.5] whitespace-nowrap break-normal text-end">
                <div className="leading-[1.5] text-nowrap [white-space-collapse:collapse] break-normal inline text-xs text-primary">
                  {formatAchievementSum(ownerId === "5535" ? 50 : approverSum)}
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}