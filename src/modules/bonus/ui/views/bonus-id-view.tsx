"use client";

import { useEffect, useRef, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useTable } from "@/hooks/use-table";

import { useTRPC } from "@/trpc/client";

import { Header } from "@/components/header";

import { createColumns } from "@/modules/bonus/ui/components/bonus-columns";
import { Toolbar } from "@/components/toolbar";
import { Banner } from "@/components/banner";
import { GoProject } from "react-icons/go";
import { LayoutProvider } from "@/layouts/layout-provider";
import { Status } from "@/generated/prisma";
import { canPerform, Role } from "../../permission";
import { WarnningBanner } from "@/components/warnning-banner";
import { Footer } from "@/components/footer";
import { BonusApprovalConfirmation } from "../components/bonus-approval-confirmation";
import { StatusBadge } from "@/components/status-badge";
import { STATUS_RECORD } from "@/types/kpi";
import { ApproveButton } from "../components/bonus-approve-button";

interface Props {
  id: string;
}

export const BonusIdView = ({ id }: Props) => {
  const trpc = useTRPC();

  const [isScrolledX, setIsScrolledX] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data } = useSuspenseQuery(trpc.kpiBonus.getById.queryOptions({ id }));

  const { table } = useTable({ 
    data: data.record?.kpis || [], 
    columns: createColumns(isScrolledX, false), 
  });

  const status = STATUS_RECORD[data.permission.context?.status || Status.NOT_STARTED];

  const perform = canPerform(
    data.permission.userRole as Role, 
    ["approve", "reject"], 
    data.permission.context?.status || Status.NOT_STARTED
  );

  const revision = canPerform(
    data.permission.userRole as Role, 
    ["submit"], 
    data.permission.context?.status || Status.NOT_STARTED
  );

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        setIsScrolledX(scrollRef.current.scrollLeft > 96);
      }
    };

    const element = scrollRef.current;
    if (element) {
      element.addEventListener("scroll", handleScroll);
      return () => element.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <>
      <Header>
        <StatusBadge {...status} />
        <ApproveButton canElevate={revision} id={data.record.id} />
      </Header>
      <main className="flex flex-col grow-0 shrink bg-background z-1 h-[calc(-44px+100vh)] max-h-full relative">
        <div className="contents">
          <div ref={scrollRef} className="flex flex-col grow relative overflow-auto me-0 mb-0">
            {(data.record.status === Status.REJECTED_BY_CHECKER) && (
              <WarnningBanner 
                message="This KPI record has been rejected by the Checker. Please review the feedback, make necessary corrections, and resubmit for approval." 
                variant="danger"
              />
            )}
            {(data.record.status === Status.REJECTED_BY_APPROVER) && (
              <WarnningBanner 
                message="This KPI record has been rejected by the Approver. Please review the feedback, make necessary corrections, and resubmit for approval." 
                variant="danger"
              />
            )}
            {perform && (
              <WarnningBanner 
                variant="warnning"
                message="Please review the employee's KPI bonus list before starting the evaluation." 
              />
            )}
            <Banner 
              title="KPI Bonus" 
              description="Reward employees with performance-based bonuses tied to goals and business impact."
              icon={GoProject} 
              className="ps-24"
            />
            <div className="contents">
              <Toolbar
                perform={false}
                table={table}
              />
              <section className="grow shrink-0 flex flex-col relative">
                <div className="h-full grow shrink-0">
                  <div className="relative float-left min-w-full select-none pb-[180px] px-24">
                    <div className="relative">
                      <LayoutProvider 
                        perform={false}
                        table={table}
                        variant="table" 
                        onCreate={() => {}}
                      />
                    </div>
                  </div>
                </div>
              </section>
              
              {perform && (
                <Footer>
                  <BonusApprovalConfirmation id={id} role={data.permission.userRole || ""} />
                </Footer>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}