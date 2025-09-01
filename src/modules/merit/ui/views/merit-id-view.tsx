"use client";

import { formatDistanceToNowStrict } from "date-fns";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { Header } from "@/components/header";
import { StatusBadge } from "@/components/status-badge";
import { SavingIndicator } from "@/components/saving-indicator";
import { STATUS_RECORD } from "@/types/kpi";
import { useContainerWidth } from "@/hooks/use-container";
import { GoProject } from "react-icons/go";
import { Banner } from "@/components/banner";
import { MeritCompetencyView } from "./merit-competency-view";
import { canPerform, Role } from "@/modules/bonus/permission";
import { Status } from "@/generated/prisma";
import { MeritCultureView } from "./merit-culture-view";
import { Footer } from "@/components/footer";
import { MeritApprovalConfirmation } from "../components/merit-approval-confirmation";
import { Comment } from "@/components/comment";
import { usePathname } from "next/navigation";
import { MeritInfo } from "../components/merit-info";

interface Props {
  id: string;
}

export const MeritIdView = ({ id }: Props) => {
  const trpc = useTRPC();
  const pathname = usePathname();

  const { width, containerRef } = useContainerWidth({
    debounceMs: 150,
    observeResize: true
  });

  const paths: string[] = pathname.split("/").filter(Boolean);

  const { data: merit } = useSuspenseQuery(trpc.kpiMerit.getById.queryOptions({ id }));

  const status = STATUS_RECORD[merit.data.status];
  const perform = canPerform(
    merit.permission.role as Role,
    ["approve", "reject"],
    merit.permission.ctx?.status || Status.NOT_STARTED
  );

  return (
    <>
      <Header 
        paths={paths}
        nameMap={{
          [id]: merit.data.preparer.fullName || "data"
        }}
        iconMap={{
          [id]: GoProject
        }}  
      >
        <SavingIndicator label={`Edited ${formatDistanceToNowStrict(merit.data.meritRecord!.meritForm.updatedAt, { addSuffix: true })}`} />
        <StatusBadge {...status} />
      </Header>
      <main className="flex flex-col grow-0 shrink bg-background z-1 h-[calc(-44px+100vh)] max-h-full relative">
        <div className="z-[1] flex flex-col grow relative overflow-y-auto overflow-x-hidden">
          <div className="grid grid-cols-[96px_1fr_96px] pb-[5vh]">
            <div className="min-w-0 col-start-2 col-end-2">
              <div ref={containerRef} className="max-w-full flex items-start flex-col w-full">
                <Banner
                  title="KPI Merit"
                  description="Evaluate employee achievements and align merit increases with performance outcomes."
                  icon={GoProject}
                />
                <MeritInfo data={merit.data} />
                <div className="w-full my-px h-[30px]" />

                <MeritCompetencyView perform={perform} width={width} data={merit.data.competencies!} />
                <div className="w-full my-px h-[30px]" />
                <MeritCultureView width={width} data={merit.data.cultures!} />
              </div>
              <div className="w-full my-px h-[30px]" />
              <Comment comments={merit.data.comments} />
            </div>
          </div>

          {perform && (
            <Footer>
              <MeritApprovalConfirmation id={id} />
            </Footer>
          )}
        </div>
      </main>
    </>
  );
}