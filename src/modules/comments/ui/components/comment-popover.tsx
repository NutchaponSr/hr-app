"use client";

import { BsChatLeftText, BsChatSquareText } from "react-icons/bs";

import { authClient } from "@/lib/auth-client";

import { Comment, Employee } from "@/generated/prisma";

import { ScrollArea } from "@/components/ui/scroll-area";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Hint } from "@/components/hint";
import { Message } from "@/components/messages";

import { UserAvatar } from "@/modules/auth/ui/components/user-avatar";
import { CommentInput } from "@/components/comment-input";

interface Props {
  comments: (Comment & {
    employee: Employee;
  })[];
  canPerform: boolean;
  onCreate: (content: string) => void;
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

export const CommentPopover = ({ 
  comments,
  canPerform,
  onCreate,
  align = "end",
  sideOffset = 8
}: Props) => {
  const { data: session } = authClient.useSession();

  const sortedComments = [...comments].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  const triggerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);

  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  const portalContainer = useMemo(() => {
    if (typeof document === "undefined") return null;
    let el = document.getElementById("comment-popover-portal-root");
    if (!el) {
      el = document.createElement("div");
      el.id = "comment-popover-portal-root";
      document.body.appendChild(el);
    }
    return el;
  }, []);

  const computePosition = useCallback(() => {
    const trigger = triggerRef.current;
    const content = contentRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();

    const contentWidth = content?.offsetWidth ?? 400;

    const top = rect.bottom + sideOffset + window.scrollY;
    let left = rect.left + window.scrollX;

    if (align === "center") {
      left = rect.left + (rect.width - contentWidth) / 2 + window.scrollX;
    } else if (align === "end") {
      left = rect.right - contentWidth + window.scrollX;
    }

    const maxLeft = window.scrollX + (window.innerWidth - contentWidth - 8);
    const minLeft = window.scrollX + 8;
    const clampedLeft = Math.max(minLeft, Math.min(maxLeft, left));

    setCoords({ top, left: clampedLeft });
  }, [align, sideOffset]);

  useEffect(() => {
    if (!open) return;
    computePosition();
    const onScroll = () => computePosition();
    const onResize = () => computePosition();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, computePosition]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        contentRef.current &&
        !contentRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const content = (
    <div
      ref={contentRef}
      className="px-3 py-2 w-100 z-9999 rounded-md bg-popover shadow-[0_14px_28px_-6px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06),0_0_0_1.25px_rgba(84,72,49,0.08)] dark:shadow-[0_0_0_1.25px_rgb(48,48,46),0_14px_28px_-6px_rgba(0,0,0,0.02),0_2px_4px_-1px_rgba(0,0,0,0.12)]"
      style={{ position: "absolute", top: coords?.top ?? -9999, left: coords?.left ?? -9999 }}
      role="dialog"
      aria-modal
    >
      <div className="flex flex-col">
        <ScrollArea className="flex flex-col max-h-40 overflow-y-auto">
          {sortedComments.length > 0 ?
            sortedComments.map((comment, index) => {
              const isLast = index === comments.length - 1;
              return (
                <Message 
                  key={index}
                  comment={comment}
                  isLast={isLast}
                />
              );
            }) : (
              <div className="w-full h-16 flex flex-col items-center justify-center text-center text-sm text-tertiary font-medium gap-1.5">
                <BsChatSquareText className="size-5 stroke-[0.25] text-primary" />
                No comments
              </div>
            )
          }
        </ScrollArea>
        <div className="border-t-[1.25px] border-border pt-3">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center grow">
              <div className="shrink-0 grow-0 me-2 self-start mt-1">
                <UserAvatar
                  name={session?.user.name || ""}
                  className={{
                    container: "size-6",
                    fallback: "text-sm"
                  }}
                />
              </div>
              <CommentInput 
                canPerform={canPerform} 
                onCreate={onCreate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Hint label="Comment">
        <div
          ref={triggerRef}
          role="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center transition h-6 px-1 whitespace-nowrap text-xs font-medium text-secondary hover:bg-primary/6 rounded relative"
        >
          <div data-active={comments.length > 0} className="absolute -top-2 -right-1.5 bg-destructive text-[10px] text-white px-1 rounded data-[active=true]:block hidden">
            {comments.length}
          </div>
          <BsChatLeftText className="size-4 stroke-[0.25]" />
        </div>
      </Hint>
      {open && portalContainer && createPortal(content, portalContainer)}
    </>
  );
}