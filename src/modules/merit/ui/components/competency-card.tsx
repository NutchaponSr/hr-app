import { ArrowDownIcon } from "lucide-react";
import { BsPencilSquare } from "react-icons/bs";
import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { cn, convertAmountFromUnit } from "@/lib/utils";

import { useTRPC } from "@/trpc/client";

import {
  Competency,
  CompetencyRecord,
  Employee,
  Comment
} from "@/generated/prisma";

import { Button } from "@/components/ui/button";

import { Card } from "@/components/card";
import { ColumnData } from "@/components/column-data";
import { CommentSection } from "@/components/comment-section";

import { CompetencyEditModal } from "@/modules/merit/ui/components/competency-edit-modal";

import { useMeritId } from "@/modules/merit/hooks/use-merit-id";
import { RowData } from "@/components/row-data";


interface Props {
  order: number;
  competency: CompetencyRecord & {
    competency: Competency | null
    comments: (Comment & {
      employee: Employee;
    })[];
  };
  perform: boolean;
}

export const CompetencyCard = ({ competency, order, perform }: Props) => {
  const trpc = useTRPC();
  const meritFormId = useMeritId();
  const queryClient = useQueryClient();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showExpandButton, setShowExpandButton] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);

  const createComment = useMutation(trpc.comment.create.mutationOptions());

  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      setShowExpandButton(contentHeight > 400);
    }
  }, [competency.output]);

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
      <div data-perform={perform} className="absolute z-1 top-4 end-4 transition-opacity p-0.5 dark:shadow-[0_2px_12px_0_rgba(29,27,22,0.06)] border-border border-[1.25px] rounded-sm gap-px opacity-0 group-hover:opacity-100 dark:bg-[#2f2f2f] data-[perform=true]:flex hidden">
        <CompetencyEditModal competency={competency}>
          <Button variant="ghost" size="iconXs">
            <BsPencilSquare className="text-secondary" />
          </Button>
        </CompetencyEditModal>
      </div>
      <div className="my-2 px-4 w-full">
        <div className="flex mt-1 self-start">
          <div className="flex items-center justify-center size-8 relative shrink-0 bg-blue-foreground me-2 rounded">
            <span className="text-xl text-blue-secondary font-bold">
              {order}
            </span>
          </div>
          <h1 data-value={!!competency.competency?.name} className="data-[value=true]:text-primary font-bold leading-[1.2] text-2xl whitespace-break-spaces break-all tracking-[0.5px] text-neutral">
            {competency.competency?.name || "Empty"}
          </h1>
        </div>
        <div className="max-w-full overflow-hidden mb-3">
          <p className="max-w-full whitespace-break-spaces break-all text-primary text-sm py-1">
            {competency.competency?.definition}
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,max-content))] w-full gap-y-2 gap-x-1 mt-2.5">
          <ColumnData header="Weight">
            {Number(convertAmountFromUnit(competency.weight || 0, 2)).toLocaleString("en-US", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })} %
          </ColumnData>
          <ColumnData header="Expected PL">
            {competency.expectedLevel || "-"}
          </ColumnData>
        </div>

        <div className="grid grid-cols-5 w-full gap-y-2 gap-x-1">
          {Array.from({ length: 5 }).map((_, index) => {
            const level = index + 1;
            const isSelected = String(level) === String(competency.expectedLevel);

            return (
              <ColumnData
                key={level}
                isSelected={isSelected}
                header={`Level ${level}`}
              >
                {
                  (() => {
                    const value = competency.competency?.[`t${level}` as keyof Competency];
                    if (value instanceof Date) {
                      return value.toLocaleString();
                    }
                    return value || "-";
                  })()
                }
              </ColumnData>
            );
          })}
        </div>

        <div className="relative">
          <div ref={contentRef} className={cn(
            "text-sm overflow-y-hidden relative transition-all duration-300", 
            isExpanded ? "max-h-none" : "max-h-[400px]")}
          >
            <h4 className="py-2.5 text-xs leading-[18px] flex flex-row items-center font-medium gap-0.5 ms-1.5 text-primary">
              Properties
            </h4>

            <div role="table" className="w-full max-w-full mx-auto">
              <RowData label="Input">
                {competency.input || "-"}
              </RowData>
              <RowData label="Output">
                {competency.output || "-"}
              </RowData>
            </div>
          </div>
          {showExpandButton && !isExpanded && (
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
          canPerform={perform}
          comments={competency.comments}
          onCreate={onCreate}
        />
      </div>
    </Card>
  );
}