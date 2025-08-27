"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDownIcon } from "lucide-react";
import { GoGear, GoMoveToStart } from "react-icons/go";

import { authClient } from "@/lib/auth-client";
import { getFirstNameFromFullName } from "@/lib/utils";

import { useSidebar } from "@/hooks/use-sidebar";

import { 
  Popover, 
  PopoverContent, 
  PopoverItem, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import { UserAvatar } from "@/modules/auth/ui/components/user-avatar";

export const UserButton = () => {
  const router = useRouter();

  const { collapse } = useSidebar();
  const { data: session, isPending } = authClient.useSession();

  const [open, setOpen] = useState(false);

  if (isPending || !session) {
    return <div className="rounded h-8 w-full bg-accent animate-pulse" />
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div 
          role="button" 
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setOpen(!open)
          }}
          className="transition flex items-center min-w-0 h-8 w-auto rounded hover:bg-black/3"
        >
          <div className="flex items-center w-full text-sm min-h-7 h-[30px] py-1 px-2 overflow-hidden">
            <div className="shrink-0 grow-0 rounded text-tertiary size-6 flex items-center justify-center mr-2">
              <UserAvatar 
                className={{ container: "size-6 rounded", fallback: "rounded" }}
                name={session?.user.name || ""}
              />
            </div>
            <div className="flex-1 whitespace-nowrap min-w-0 overflow-hidden text-ellipsis">
              <div className="flex justify-start items-center">
                <h4 className="text-primary font-medium whitespace-nowrap overflow-hidden text-ellipsis leading-5 me-1.5">
                  {getFirstNameFromFullName(session?.user.name || "")}
                </h4>
                <ChevronDownIcon className="size-4 text-muted" />
              </div>
            </div>
          </div>
          <div className="flex items-center h-full ml-auto">
            <div className="items-center inline-flex me-0.5 gap-0.5">
              <Button 
                variant="ghost" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  collapse();
                }}
                className="size-6.5 group-hover:opacity-100 opacity-0 transition-opacity" 
              >
                <GoMoveToStart className="size-4 text-tertiary stroke-[0.3]" />
              </Button>
            </div>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent align="start" side="bottom" className="w-80 p-0">
        <div className="flex flex-col p-3 gap-3">
          <div className="flex flex-row gap-2.5 items-center">
            <UserAvatar 
              className={{ 
                container: "size-8 rounded", 
                fallback: "rounded text-lg" 
              }}
              name={session?.user.name || ""}
            />
            <div className="flex flex-col whitespace-nowrap overflow-hidden text-ellipsis">
              <h4 className="text-sm leading-4 text-primary whitespace-nowrap text-ellipsis overflow-hidden font-semibold">
                {session!.user.name}
              </h4>
              <p className="text-xs text-tertiary whitespace-nowrap text-ellipsis overflow-hidden">
                Role · {session!.user.role}
              </p>
            </div>
          </div>
          <div className="inline-flex gap-2">
            <Button variant="outline" size="sm">
              <GoGear className="stroke-[0.25]" />
              Settings
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center w-full px-3">
          <div className="w-full border-b-[1.25px] border-border h-[1.25px]" />
        </div>
        <div className="p-1 flex flex-col gap-px">
          <PopoverItem 
            label="Log out"
            onClick={() => authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  router.refresh();
                },
              },
            })} 
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}