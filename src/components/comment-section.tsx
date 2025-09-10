import { useEffect, useState } from "react";
import { format } from "date-fns";

import { authClient } from "@/lib/auth-client";

import { Comment, Employee } from "@/generated/prisma";

import { 
  Popover, 
  PopoverTrigger, 
  PopoverContent 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Message } from "@/components/messages";
import { CommentInput } from "@/components/comment-input";

import { UserAvatar } from "@/modules/auth/ui/components/user-avatar";

interface Props {
  id: string;
  comments?: (Comment & {
    employee: Employee;
  })[];
  canPerform: boolean;
}

export const CommentSection = ({ id, comments, canPerform }: Props) => {
  const { data: session } = authClient.useSession();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex flex-col gap-3 pt-3">
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (comments && comments.length > 0) {
    const sortedComments = [...comments].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    const latestComment = sortedComments[sortedComments.length - 1];

    return (
      <div className="flex flex-col gap-3 pt-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="justify-start px-2">
              <UserAvatar
                name={latestComment.employee.fullName}
                className={{
                  container: "size-6",
                  fallback: "text-sm"
                }}
              />
              <div className="flex items-baseline gap-2">
                <div className="text-sm">
                  {comments.length} {comments.length === 1 ? "reply" : "replies"}
                </div>
                <div className="text-xs text-foreground">
                  {format(latestComment.createdAt, "hh:mm aa")}
                </div>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent side="bottom" className="w-[var(--radix-popover-trigger-width)] p-2">
            <div className="flex flex-col gap-3">
              <ScrollArea className="flex flex-col gap-2 max-h-40 overflow-y-auto">
                {sortedComments.map((comment, index) => {
                  const isLast = index === comments.length - 1;
                  return (
                    <Message 
                      key={index}
                      comment={comment}
                      isLast={isLast}
                    />
                  );
                })}
              </ScrollArea>
              <div className="border-t pt-3">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center grow">
                    <div className="shrink-0 grow-0 me-2 self-start mt-1">
                      <UserAvatar
                        name={session.user.name || ""}
                        className={{
                          container: "size-6",
                          fallback: "text-sm"
                        }}
                      />
                    </div>
                    <CommentInput id={id} canPerform={canPerform} />
                  </div>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 pt-3">
      <div className="flex items-center gap-1.5">
        <div className="flex items-center grow">
          <div className="shrink-0 grow-0 me-2 self-start mt-1">
            <UserAvatar
              name={session.user.name || ""}
              className={{
                container: "size-6",
                fallback: "text-sm"
              }}
            />
          </div>
          <CommentInput id={id} canPerform={canPerform} />
        </div>
      </div>
    </div>
  );
}