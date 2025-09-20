import { format, formatDistanceToNowStrict } from "date-fns";

import { CommentWithOwner } from "@/types/kpi";

import { 
  HoverCard, 
  HoverCardContent, 
  HoverCardTrigger 
} from "@/components/ui/hover-card";

import { UserAvatar } from "@/modules/auth/ui/components/user-avatar";

interface Props {
  isLast?: boolean;
  comment: CommentWithOwner;
}

export const Message = ({ isLast, comment }: Props) => {
  return (
    <div className="py-2">
      <div className="relative text-sm">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center select-none text-sm gap-1.5">
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="flex items-center gap-1.5">
                  <UserAvatar
                    name={comment.employee.fullName}
                    className={{
                      container: "size-6",
                      fallback: "text-sm font-normal"
                    }}
                  />
                  <div className="block">
                    <div className="font-semibold whitespace-normal text-primary">
                      {comment.employee.fullName}
                    </div>
                  </div>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="max-w-100 min-w-70 p-3">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <UserAvatar
                      name={comment.employee.fullName}
                      className={{
                        container: "size-14",
                        fallback: "text-3xl font-bold"
                      }}
                    />
                    <div className="flex flex-col gap-[3px] overflow-hidden w-full">
                      <h3 className="text-sm leading-5 text-primary whitespace-nowrap overflow-hidden text-ellipsis font-semibold">
                        {comment.employee.fullName}
                      </h3>
                      <h5 className="text-xs leading-4 text-tertiary whitespace-break-spaces overflow-hidden text-ellipsis">
                        {comment.employee.department}
                      </h5>
                      <p className="text-xs leading-4 text-foreground whitespace-break-spaces overflow-hidden text-ellipsis">
                        {format(comment.createdAt, "hh:mm a")}
                      </p>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
            
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
}