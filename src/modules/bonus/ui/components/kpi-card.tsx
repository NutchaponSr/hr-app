import { useState } from "react";
import { BsFileText } from "react-icons/bs";
import { ArrowDownIcon } from "lucide-react";

import { convertAmountFromUnit } from "@/lib/utils";

import { Comment, Employee, Kpi } from "@/generated/prisma";

import { Card } from "@/components/card";
import { ColumnData } from "@/components/column-data";
import { ContentBlock } from "@/components/content-block";
import { CommentSection } from "@/components/comment-section";
import { SelectionBadge } from "@/components/selection-badge";

import { KpiCardHeader } from "@/modules/bonus/ui/components/kpi-card-header";

import { projectTypes } from "@/modules/bonus/constants";
import { useTRPC } from "@/trpc/client";
import { useKpiFormId } from "../../hooks/use-kpi-form-id";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Props {
  canPerform: boolean;
  kpi: Kpi & { 
    comments: (Comment & {
      employee: Employee;
    })[]; 
  };
}

export const KpiCard = ({ 
  canPerform,
  kpi 
}: Props) => {
  const trpc = useTRPC();
  const kpiFormId = useKpiFormId();
  const queryClient = useQueryClient();

  const [isExpanded, setIsExpanded] = useState(false);

  const createComment = useMutation(trpc.comment.create.mutationOptions());

  const onCreate = (content: string) => {
    createComment.mutate({
      content,
      connectId: kpi.id,
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.kpiMerit.getById.queryOptions({ id: kpiFormId }));
      },
    });
  }

  return (
    <Card>
      <KpiCardHeader kpi={kpi} canPerform={canPerform} />
      <div className="my-2 px-4">
        <div className="mb-1 px-0.5 flex flex-row items-center space-x-1">
          <div className="flex items-center justify-center size-[26px]">
            <BsFileText className="size-6 text-marine" />
          </div>
          <h1 className="max-w-full w-full whitespace-break-spaces break-words text-primary text-2xl inline font-semibold leading-[100%]">
            {kpi.name}
          </h1>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,max-content))] w-full gap-y-2 gap-x-1 mt-2.5 mb-3">
          <ColumnData header="Link to strategy">
            {kpi.strategy}
          </ColumnData>
          <ColumnData header="Type">
            <SelectionBadge label={projectTypes[kpi.type!]} />
          </ColumnData>
          <ColumnData header="Weight">
            {Number(convertAmountFromUnit(kpi.weight, 2)).toLocaleString("en-US", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })} %
          </ColumnData>
        </div>

        <div className="relative">
          <div className={`text-sm overflow-y-hidden relative transition-all duration-300 ${isExpanded ? 'max-h-none' : 'max-h-[400px]'
            }`}>
            <ContentBlock
              title="Objective"
              content={kpi.objective}
            />
            <ContentBlock
              title="Definition"
              content={kpi.definition}
            />
            <h4 className="py-0.5 text-sm leading-[18px] flex flex-row items-center font-medium gap-0.5 text-tertiary my-4 pb-1 border-b-[1.25px] border-border">
              Target
            </h4>
            <ContentBlock
              title="< 70%"
              content={kpi.target70}
            />
            <ContentBlock
              title="80%"
              content={kpi.target80}
            />
            <ContentBlock
              title="90%"
              content={kpi.target90}
            />
            <ContentBlock
              title="100%"
              content={kpi.target100}
            />
          </div>
          {!isExpanded && (
            <div className="absolute flex justify-center items-start z-1 inset-x-0 h-7.5 -mt-7 dark:bg-[linear-gradient(rgba(241,241,239,0)_0px,rgb(37,37,37)_30px)] bg-[linear-gradient(rgb(255,255,255)_0px,rgb(255,255,255)_30px)]">
              <button
                onClick={() => setIsExpanded(true)}
                className="bg-[#30302e] text-white rounded py-1 px-2 dark:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08),inset_0_0_0_1px_rgba(255,255,255,0.05)] text-xs leading-[1.4] flex items-center justify-center -mt-1 hover:bg-[#3a3a38] transition-colors"
              >
                <ArrowDownIcon className="size-3 me-1" />
                See more
              </button>
            </div>
          )}
        </div>

        <CommentSection 
          comments={kpi.comments}
          canPerform={canPerform}
          onCreate={onCreate}
        />
      </div>
    </Card>
  );
}