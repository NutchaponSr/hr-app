"use client";

import { formatDistanceToNowStrict } from "date-fns";

import { CommentWithOwner } from "@/types/kpi";

import { UserAvatar } from "@/modules/auth/ui/components/user-avatar";

interface Props {
  comments: CommentWithOwner[];
}

export const Comment = ({ comments }: Props) => {
  return (
    <div className="flex flex-col grow gap-3 sticky start-0 ps-24">
      <div className="flex flex-col gap-0.5">
        <h4 className="py-0.5 text-xs leading-[18px] text-tertiary flex flex-row items-center font-medium gap-0.5">
          Comments
        </h4>
        <div className="w-full mx-auto">
          <div className="mt-0 mb-4 -mx-4">
            <div className="relative">
              {comments.map((comment, index) => {
                const isLast = index === comments.length - 1;
                return (
                  <div key={comment.id} className="py-2 px-4">
                    <div className="relative text-sm">
                      <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-row items-center select-none text-sm gap-1.5">
                          <div className="flex items-center gap-1.5">
                            <UserAvatar
                              name={comment.employee.fullName}
                              className={{
                                container: "size-6",
                                fallback: "text-sm font-normal"
                              }}
                            />
                            <div className="block">
                              <div className="font-medium whitespace-normal text-primary">
                                {comment.employee.fullName}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-foreground whitespace-normal grow inline leading-4">
                            {formatDistanceToNowStrict(comment.createdAt)}
                          </div>
                        </div>
                      </div>
                      {!isLast && (
                        <div className="absolute bg-ring rounded-xs w-[1.5px] h-[calc(100%-20px)] start-[11.25px] top-[30px]" />
                      )}
                      <div className="ps-8">
                        <div className="flex flex-row justify-between">
                          <div className="max-w-full w-full whitespace-break-spaces break-words text-primary leading-5 pt-1">
                            {comment.content}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}