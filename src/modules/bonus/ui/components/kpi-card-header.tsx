import { 
  BsCalendar3, 
  BsCopy, 
  BsPencilSquare, 
  BsTrash3 
} from "react-icons/bs";
import { toast } from "sonner";
import { MoreHorizontalIcon } from "lucide-react";
import { format, formatDistanceToNowStrict } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { formatDateUpdatedAt } from "@/lib/utils";

import { Kpi } from "@/generated/prisma";
import { useTRPC } from "@/trpc/client";

import { useConfirm } from "@/hooks/use-confirm";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { 
  HoverCard, 
  HoverCardContent, 
  HoverCardTrigger 
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";

import { BonusEditModal } from "@/modules/bonus/ui/components/bonus-edit-modal";

import { useKpiFormId } from "@/modules/bonus/hooks/use-kpi-form-id";

interface Props {
  kpi: Kpi;
  canPerform: boolean;
}

export const KpiCardHeader = ({ 
  kpi,
  canPerform 
}: Props) => {
  const trpc = useTRPC();
  const kpiFormId = useKpiFormId();
  const queryClient = useQueryClient();

  const [ConfirmDialog, confirm] = useConfirm({
    title: "Are you sure you want to delete this Kpi?",
    className: "w-80",
  });

  const deleteKpi = useMutation(trpc.kpiBonus.deleteKpi.mutationOptions());
  const duplicateKpi = useMutation(trpc.kpiBonus.duplicateKpi.mutationOptions());

  const onDelete = async () => {
    const ok = await confirm();

    if (ok) {
      toast.loading("Deleting kpi...", { id: "delete-kpi" });
      deleteKpi.mutate({ id: kpi.id }, {
        onSuccess: () => {
          queryClient.invalidateQueries(trpc.kpiBonus.getById.queryOptions({ id: kpiFormId }));
          toast.success("Deleted!", { id: "delete-kpi" });
        },
      });
    }
  }

  const onDuplicate = () => {
    toast.loading("Duplicating kpi...", { id: "dplicate-kpi" });
    duplicateKpi.mutate({ id: kpi.id }, {
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.kpiBonus.getById.queryOptions({ id: kpiFormId }));
        toast.success("Duplicated!", { id: "dplicate-kpi" });
      },
    });
  }

  return (
    <>
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
      <div className="my-0.5 pb-1">
        <div className="flex flex-row items-center select-none text-sm gap-1.5">
          <HoverCard>
            <HoverCardTrigger asChild>
              <p className="text-xs leading-4 text-tertiary whitespace-normal grow inline">
                {formatDistanceToNowStrict(kpi.createdAt)}
              </p>
            </HoverCardTrigger>
            <HoverCardContent align="start" side="bottom" className="p-2 bg-background">
              <div className="flex items-center gap-1.5 text-tertiary">
                <BsCalendar3 className="size-3" />
                <p className="text-xs text-ellipsis whitespace-nowrap overflow-hidden">
                  {format(kpi.createdAt, "MMMM dd, yyyy")} at {format(kpi.createdAt, "hh:mm:ss aa")}
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
    </>
  );
}