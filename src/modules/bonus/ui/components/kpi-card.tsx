import { useEffect, useRef, useState } from "react";
import { BsCopy, BsFileText, BsPencilSquare, BsTrash3 } from "react-icons/bs";
import { ArrowDownIcon, MoreHorizontalIcon } from "lucide-react";

import { cn, convertAmountFromUnit, formatDateUpdatedAt } from "@/lib/utils";

import { Comment, Employee, Kpi } from "@/generated/prisma";

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

import { Card } from "@/components/card";
import { ColumnData } from "@/components/column-data";
import { ContentBlock } from "@/components/content-block";
import { CommentSection } from "@/components/comment-section";
import { SelectionBadge } from "@/components/selection-badge";


import { kpiCategoies, projectTypes } from "@/modules/bonus/constants";
import { useTRPC } from "@/trpc/client";
import { useKpiFormId } from "../../hooks/use-kpi-form-id";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";
import { BonusEditModal } from "./bonus-edit-modal";
import { Button } from "@/components/ui/button";
import { RowData } from "@/components/row-data";

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
  const [showExpandButton, setShowExpandButton] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);
  const [ConfirmDialog, confirm] = useConfirm({
    title: "Are you sure you want to delete this Kpi?",
    className: "w-80",
  });

  const createComment = useMutation(trpc.comment.create.mutationOptions());
  const deleteKpi = useMutation(trpc.kpiBonus.deleteKpi.mutationOptions());
  const duplicateKpi = useMutation(trpc.kpiBonus.duplicateKpi.mutationOptions());

  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      setShowExpandButton(contentHeight > 400);
    }
  }, [kpi.target100]);
  
  const onDelete = async () => {
    const ok = await confirm();

    if (ok) {
      toast.loading("Deleting kpi...", { id: "delete-kpi" });
      deleteKpi.mutate({ id: kpi.id }, {
        onSuccess: () => {
          queryClient.invalidateQueries(trpc.kpiBonus.getByFormId.queryOptions({ formId: kpiFormId }));
          toast.success("Deleted!", { id: "delete-kpi" });
        },
      });
    }
  }

  const onDuplicate = () => {
    toast.loading("Duplicating kpi...", { id: "dplicate-kpi" });
    duplicateKpi.mutate({ id: kpi.id }, {
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.kpiBonus.getByFormId.queryOptions({ formId: kpiFormId }));
        toast.success("Duplicated!", { id: "dplicate-kpi" });
      },
    });
  }

  const onCreate = (content: string) => {
    createComment.mutate({
      content,
      connectId: kpi.id,
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.kpiMerit.getByFormId.queryOptions({ formId: kpiFormId }));
      },
    });
  }

  return (
    <Card>
      <ConfirmDialog />
        <div data-perform={canPerform} className="absolute z-1 top-4 end-4 transition-opacity p-0.5 dark:shadow-[0_2px_12px_0_rgba(29,27,22,0.06)] border-border border-[1.25px] rounded-sm gap-px opacity-0 group-hover:opacity-100 dark:bg-[#2f2f2f] data-[perform=true]:flex hidden">
        <BonusEditModal kpi={kpi}>
          <Button variant="ghost" size="iconXs">
            <BsPencilSquare className="text-secondary" />
          </Button>
        </BonusEditModal>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="iconXs">
              <MoreHorizontalIcon className="text-secondary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={onDuplicate}>
                <BsCopy className="!stroke-[0.25]" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={onDelete}>
                <BsTrash3 className="!stroke-[0.25]" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="flex items-center gap-2 leading-[120%] w-full select-none min-h-7 text-sm px-2">
                <p className="text-xs text-tertiary dark:text-foreground whitespace-nowrap overflow-hidden text-ellipsis leading-4">
                  Edited: {formatDateUpdatedAt(kpi.updatedAt)} 
                </p>
              </div>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="my-2 px-4">
        <div className="mb-1 px-0.5 flex flex-row items-center space-x-1">
          <div className="flex items-center justify-center size-[26px]">
            <BsFileText className="size-6 text-marine" />
          </div>
          <h1 className="max-w-full w-full whitespace-break-spaces break-words text-primary text-2xl inline font-semibold leading-[100%]">
            {kpi.name}
          </h1>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,max-content))] w-full gap-y-2 gap-x-1 my-2.5">
          <ColumnData header="Category">
            <SelectionBadge label={kpiCategoies[kpi.category]} />
          </ColumnData>
          <ColumnData header="Type">
            <SelectionBadge label={projectTypes[kpi.type]} />
          </ColumnData>
          <ColumnData header="Weight">
            {Number(convertAmountFromUnit(kpi.weight, 2)).toLocaleString("en-US", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })} %
          </ColumnData>
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
              <RowData label="Link to strategy">
                {kpi.strategy}
              </RowData>
              <RowData label="Objective">
                {kpi.objective}
              </RowData>
              <RowData label="Measure (Unit / Method)">
                {kpi.definition}
              </RowData>
            </div>

            <h4 className="py-2.5 text-xs leading-[18px] flex flex-row items-center font-medium gap-0.5 ms-1.5 text-primary">
              Target definition
            </h4>

            <div role="table" className="w-full max-w-full mx-auto">
              <RowData label="< 70%">
                {kpi.target70}
              </RowData>
              <RowData label="80%">
                {kpi.target80}
              </RowData>
              <RowData label="90%">
                {kpi.target90}
              </RowData>
              <RowData label="100%">
                {kpi.target100}
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
          comments={kpi.comments}
          canPerform={canPerform}
          onCreate={onCreate}
        />
      </div>
    </Card>
  );
}