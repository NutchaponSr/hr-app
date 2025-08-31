"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

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
import toast from "react-hot-toast";
import { SavingIndicator } from "@/components/saving-indicator";
import { formatDistanceToNowStrict } from "date-fns";
import { Comment } from "@/components/comment";
import { usePathname } from "next/navigation";

interface Props {
  id: string;
}

export const BonusIdView = ({ id }: Props) => {
  const trpc = useTRPC();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const [isScrolledX, setIsScrolledX] = useState(false);

  const paths: string[] = pathname.split("/").filter(Boolean);

  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: kpiBonus } = useSuspenseQuery(trpc.kpiBonus.getById.queryOptions({ id }));

  const create = useMutation(trpc.kpiBonus.createKpi.mutationOptions());

  const status = STATUS_RECORD[kpiBonus.permission.ctx?.status || Status.NOT_STARTED];

  const perform = canPerform(
    kpiBonus.permission.role as Role,
    ["approve", "reject"],
    kpiBonus.permission.ctx?.status || Status.NOT_STARTED
  );

  const revision = canPerform(
    kpiBonus.permission.role as Role,
    ["submit"],
    kpiBonus.permission.ctx?.status || Status.NOT_STARTED
  );

  const { table } = useTable({
    data: kpiBonus.data.kpiRecord?.kpiForm.kpis || [],
    columns: createColumns(isScrolledX, perform),
  });

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

  const name = kpiBonus.data.preparer.fullName;

  return (
    <>
      <Header
        paths={paths}
        nameMap={{
          [id]: name || "data"
        }}
        iconMap={{
          [id]: GoProject
        }}
      >
        <SavingIndicator label={`Edited ${formatDistanceToNowStrict(kpiBonus.data.kpiRecord!.kpiForm.updatedAt, { addSuffix: true })}`} />
        <StatusBadge {...status} />
        <ApproveButton canElevate={revision} id={id} />
      </Header>
      <main className="flex flex-col grow-0 shrink bg-background z-1 h-[calc(-44px+100vh)] max-h-full relative">
        <div className="contents">
          <div ref={scrollRef} className="flex flex-col grow relative overflow-auto me-0 mb-0">
            {(kpiBonus.data.status === Status.REJECTED_BY_CHECKER) && (
              <WarnningBanner
                variant="danger"
                message="This KPI record has been rejected by the Checker. Please review the feedback, make necessary corrections, and resubmit for approval."
              />
            )}
            {(kpiBonus.data.status === Status.REJECTED_BY_APPROVER) && (
              <WarnningBanner
                variant="danger"
                message="This KPI record has been rejected by the Approver. Please review the feedback, make necessary corrections, and resubmit for approval."
              />
            )}
            {(kpiBonus.data.status === Status.REJECTED_BY_CHECKER && perform) && (
              <WarnningBanner
                variant="warning"
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
                perform={perform}
                table={table}
              />
              <section className="flex flex-col relative">
                <div className="h-full grow shrink-0">
                  <div className="relative float-left min-w-full select-none px-24">
                    <div className="relative">
                      <LayoutProvider
                        perform={perform}
                        table={table}
                        variant="table"
                        onCreate={() => {
                          create.mutate({ kpiFormId: kpiBonus.data.kpiRecord!.kpiFormId }, {
                            onSuccess: () => {
                              queryClient.invalidateQueries(
                                trpc.kpiBonus.getById.queryOptions({ id }),
                              );
                            },
                            onError: (error) => {
                              toast.error(error.message);
                            },
                          })
                        }}
                      />
                    </div>
                  </div>
                </div>
              </section>
              <Comment comments={kpiBonus.data.comments} />

              {perform && (
                <Footer>
                  <BonusApprovalConfirmation id={id} />
                </Footer>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}