import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { convertAmountFromUnit } from "@/lib/utils";

import { useTRPC } from "@/trpc/client";

import { 
  Competency, 
  CompetencyRecord, 
  Employee, 
  Comment 
} from "@/generated/prisma";

import { Card } from "@/components/card";
import { ColumnData } from "@/components/column-data";
import { ContentBlock } from "@/components/content-block";
import { CommentSection } from "@/components/comment-section";

import { CompetencyCardHeader } from "@/modules/merit/ui/components/competency-card-header";

import { useMeritId } from "@/modules/merit/hooks/use-merit-id";

interface Props {
  order: number;
  competency: CompetencyRecord & { 
    competency: Competency | null 
    comments: (Comment & {
      employee: Employee;
    })[]; 
  };
}

export const CompetencyCard = ({ competency, order }: Props) => {
  const trpc = useTRPC();
  const meritFormId = useMeritId();
  const queryClient = useQueryClient();

  const [isExpanded, setIsExpanded] = useState(false);

  const createComment = useMutation(trpc.comment.create.mutationOptions());

  const onCreate = (content: string) => {
    createComment.mutate({
      content,
      connectId: competency.id,
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.kpiMerit.getById.queryOptions({ id: meritFormId }));
      },
    });
  }

  return (
    <Card>
      <CompetencyCardHeader competency={competency} canPerform={true} />
      <div className="w-full">
        <div className="flex mt-1 self-start">
          <div className="flex items-center justify-center size-8 relative shrink-0 bg-blue-foreground me-2 rounded">
            <span className="text-xl text-blue-secondary font-bold">
              {order}
            </span>
          </div>
          <h1 className="text-primary font-bold leading-[1.2] text-2xl whitespace-break-spaces break-all tracking-[0.5px]">
            {competency.competency?.name}
          </h1>
        </div>
        <div className="max-w-full overflow-hidden mb-3">
          <p className="max-w-full w-[780px] whitespace-break-spaces break-words text-primary text-sm">
            {competency.competency?.definition}
          </p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,max-content))] w-full gap-y-2 gap-x-1 mt-2.5 mb-3">
          <ColumnData header="Weight">
            {Number(convertAmountFromUnit(competency.weight || 0, 2)).toLocaleString("en-US", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })} %
          </ColumnData>
        </div>

        <div className="relative">
          <div className={`text-sm overflow-y-hidden relative transition-all duration-300 ${isExpanded ? 'max-h-none' : 'max-h-[400px]'
            }`}
          >
            <ContentBlock
              title="Input"
              content={competency.input}
            />
            <ContentBlock
              title="Output"
              content={competency.input}
            />
          </div>
        </div>

        <CommentSection 
          canPerform={true}
          comments={competency.comments}
          onCreate={onCreate}
        />
      </div>
    </Card>
  );
}