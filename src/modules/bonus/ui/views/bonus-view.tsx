"use client";

import { GoProject } from "react-icons/go";
import { usePathname } from "next/navigation";
import { BsTriangleFill } from "react-icons/bs";
import { formatDistanceToNowStrict } from "date-fns";
import { useSuspenseQuery } from "@tanstack/react-query";

import { convertAmountFromUnit } from "@/lib/utils";

import { Status } from "@/generated/prisma";
import { STATUS_RECORD } from "@/types/kpi";

import { useTRPC } from "@/trpc/client";
import { useUploadStore } from "@/store/use-upload-modal-store";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import { Hint } from "@/components/hint";
import { Banner } from "@/components/banner";
import { Header } from "@/components/header";
import { Toolbar } from "@/components/toolbar";
import { StatusBadge } from "@/components/status-badge";
import { WarnningBanner } from "@/components/warnning-banner";
import { SelectionBadge } from "@/components/selection-badge";
import { SavingIndicator } from "@/components/saving-indicator";

import { KpiCard } from "@/modules/bonus/ui/components/kpi-card";
import { BonusInfo } from "@/modules/bonus/ui/components/bonus-info";
import { ApproveButton } from "@/modules/bonus/ui/components/bonus-approve-button";

import { useBonusModalStore } from "@/modules/bonus/store/use-bonus-modal-store";

import { kpiCategoies } from "@/modules/bonus/constants";
import { canPerform, Role } from "@/modules/bonus/permission";
import { Footer } from "@/components/footer";
import { BonusApprovalConfirmation } from "../components/bonus-approval-confirmation";

interface Props {
  id: string;
}

export const BonusView = ({
  id,
}: Props) => {
  const trpc = useTRPC();
  const pathname = usePathname();

  const { openModal } = useUploadStore();
  const { onOpen } = useBonusModalStore();

  const paths: string[] = pathname.split("/").filter(Boolean);

  const { data: kpiBonus } = useSuspenseQuery(trpc.kpiBonus.getById.queryOptions({ id }));

  const status = STATUS_RECORD[kpiBonus.data.task.status];
  const perform = canPerform(
    kpiBonus.permission.role as Role,
    ["approve", "reject"],
    kpiBonus.permission.ctx?.status
  );

  const revision = canPerform(
    kpiBonus.permission.role as Role,
    ["submit"],
    kpiBonus.permission.ctx?.status
  );
  const totalWeight = convertAmountFromUnit(kpiBonus.data.kpis.reduce((acc, kpi) => acc + kpi.weight, 0), 2);

  const groupedKpis = kpiBonus.data.kpis.reduce((acc, kpi) => {
    const categoryKey = kpi.category;
    const categoryName = categoryKey ? kpiCategoies[categoryKey] : 'Uncategorized';
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(kpi);
    return acc;
  }, {} as Record<string, typeof kpiBonus.data.kpis>);

  return (
    <>
      <Header paths={paths}
        nameMap={{
          [id]: String(kpiBonus.data.year)
        }}
        iconMap={{
          [id]: GoProject
        }}>
        {kpiBonus.data.updatedAt && (
          <SavingIndicator label={`Edited ${formatDistanceToNowStrict(kpiBonus.data.updatedAt, { addSuffix: true })}`} />
        )}
        <StatusBadge {...status} />
        <ApproveButton
          canElevate={perform || revision}
          taskId={kpiBonus.data.taskId}
        />
      </Header>
      <main className="flex flex-col grow-0 shrink bg-background z-1 h-[calc(-44px+100vh)] max-h-full relative">
        <div className="contents">
          {(kpiBonus.data?.task?.status === Status.REJECTED_BY_CHECKER) && (
            <WarnningBanner
              message="This KPI record has been rejected by the Checker. Please review the feedback, make necessary corrections, and resubmit for approval."
              variant="danger"
            />
          )}
          <div className="flex flex-col grow relative overflow-auto me-0 mb-0">
            <Banner
              title="KPI Bonus"
              description="Reward employees with performance-based bonuses tied to goals and business impact."
              icon={GoProject}
              className="ps-24"
            />
            {kpiBonus.data?.task && (
              <BonusInfo data={kpiBonus.data.task} />
            )}
            <Toolbar
              perform={perform || revision}
              onCreate={() => onOpen("create")}
              onUpload={() => openModal("kpi", kpiBonus.data.id)}
              context={
                <div className="flex flex-row items-center gap-x-2 gap-y-1.5">
                  <SelectionBadge label="Weight" />
                  <span className="text-sm text-primary">
                    {totalWeight.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </span>
                  <Hint label={`${totalWeight} / 100`}>
                    <Progress
                      className="h-1 w-40"
                      value={totalWeight}
                    />
                  </Hint>
                </div>
              }
            />
            <div className="grow shrink-0 flex flex-col relative z-85">
              <div className="px-24 pb-[180px] pt-3">
                <div className="flex flex-col gap-4 mx-auto ps-0 max-w-3xl">
                  <Accordion
                    type="multiple"
                    className="h-full relative"
                    defaultValue={Object.keys(groupedKpis)}
                  >
                    {Object.entries(groupedKpis).map(([categoryName, kpis], index) => (
                      <AccordionItem key={index} value={categoryName}>
                        <div className="h-[42px] z-87 relative text-sm">
                          <div className="flex items-center h-full pt-0 mb-2">
                            <div className="flex items-center h-full overflow-hidden gap-1">
                              <AccordionTrigger asChild>
                                <Button variant="ghost" size="iconXs" className="group">
                                  <BsTriangleFill className="text-primary rotate-90 size-3 transition-transform group-data-[state=open]:rotate-180" />
                                </Button>
                              </AccordionTrigger>
                              <SelectionBadge label={categoryName} />
                              <Hint label="Count all" side="top" align="center">
                                <Button variant="ghost" size="xs" className="text-foreground">
                                  {kpis.length}
                                </Button>
                              </Hint>
                            </div>
                          </div>
                        </div>
                        <AccordionContent className="relative mb-3 flex flex-col gap-8">
                          {kpis.map((kpi, idx) => (
                            <KpiCard
                              key={idx}
                              kpi={kpi}
                              canPerform={perform || revision}
                            />
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            </div>

            {perform && (
              <Footer>
                <BonusApprovalConfirmation taskId={kpiBonus.data.taskId} />
              </Footer>
            )}
          </div>
        </div>
      </main>
    </>
  );
}