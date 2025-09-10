import { useState } from "react";
import { BsArrowUpCircleFill } from "react-icons/bs";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { cn } from "@/lib/utils";

import { useTRPC } from "@/trpc/client";

import { useKpiFormId } from "@/modules/bonus/hooks/use-kpi-form-id";

interface Props {
  id: string;
  canPerform: boolean;
}

export const CommentInput = ({ id, canPerform }: Props) => {
  const trpc = useTRPC();

  const kpiFormId = useKpiFormId();
  const queryClient = useQueryClient();

  const [message, setMessage] = useState("");

  const create = useMutation(trpc.comment.create.mutationOptions());

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    create.mutate({ 
      content: message,
      connectId: id,
    }, {
      onSuccess: () => {
        setMessage("");
        queryClient.invalidateQueries(trpc.kpiBonus.getById.queryOptions({ id: kpiFormId }));
      },
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-wrap self-center relative justify-end text-sm cursor-text bg-transparent items-center gap-y-1 gap-x-1.5 p-1 w-full">
      <div className="grow flex min-h-6 pt-0.5">
        <textarea 
          required
          rows={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add a comment..."
          className="max-w-full w-full whitespace-pre-wrap break-words text-primary text-sm p-0.5 -m-0.5 leading-5 overflow-hidden focus-visible:outline-none resize-none h-full field-sizing-content break-all"
        />
      </div>
      <div className="flex flex-col-reverse items-end w-min">
        <div className="flex flex-row items-center gap-1.5">
          <button 
            disabled={!canPerform}
            className={cn(
              "select-none transition-all inline-flex opacity-40 items-center justify-center shrink-0 rounded size-6 p-0",
              message && "opacity-100 hover:bg-[#298bfd10]",
              !canPerform && "opacity-40"
            )}
          >
            <BsArrowUpCircleFill className={cn("size-5", message ? "text-marine" : "text-muted")} />
          </button>
        </div>
      </div>
    </form>
  );
}