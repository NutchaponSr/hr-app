import { format } from "date-fns";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BsBullseye } from "react-icons/bs";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { STATUS_RECORD } from "@/types/kpi";

import { App } from "@/generated/prisma";

import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import { 
  MainHeader, 
  MainTitle 
} from "@/components/main";
import { StatusBadge } from "@/components/status-badge";
import { SelectionBadge } from "@/components/selection-badge";

import { UserAvatar } from "@/modules/auth/ui/components/user-avatar";

import { tasks as types } from "@/modules/tasks/type";

interface Props {
  year: number;
}

export const Tracker = ({ year }: Props) => {
  const trpc = useTRPC();
  const router = useRouter();

  const [value, setValue] = useState<"ALL" | App>("ALL"); 
  
  const { data: tasks } = useSuspenseQuery(trpc.task.getManyByYear.queryOptions({ year }));

  const filteredTasks = useMemo(() => value === "ALL" ? tasks : tasks.filter((task) => task.app === value), [tasks, value]);

  return (
    <>
      <MainHeader>
        <MainTitle>
          <BsBullseye className="size-3 shrink-0" />
          <span className="whitespace-nowrap text-ellipsis overflow-hidden font-medium">
            Form tracker
          </span>
        </MainTitle>
      </MainHeader> 

      <Tabs value={value} onValueChange={(v) => setValue(v as "ALL" | App)}>
        <div className="w-full border-b-[1.25px] border-border">
          <TabsList>
            <TabsTrigger value="ALL">
              All
            </TabsTrigger>
            <TabsTrigger value="BONUS">
              Bonus
            </TabsTrigger>
            <TabsTrigger value="MERIT">
              Merit
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value={value}>
          <table className="w-full">
            <thead>
              <tr className="flex relative shadow-[inset_0_-1px_0_rgb(233,233,231)] dark:shadow-[inset_0_-1px_0_rgb(47,47,47)]">
                <th className="h-8 flex items-center px-3 min-w-[250px] w-[35%] shadow-[inset_-1px_0_0_rgb(233,233,231)] dark:shadow-[inset_-1px_0_0_rgb(47,47,47)]">
                  <Button variant="ghost" size="xxs">
                    <span className="text-xs text-secondary">
                      Employee
                    </span>
                  </Button>
                </th>
                <th className="h-8 flex items-center px-3 min-w-[85px] w-[15%]">
                  <span className="text-xs text-secondary font-normal">
                    App
                  </span>
                </th>
                <th className="h-8 flex items-center px-3 min-w-[125px] w-[20%]">
                  <span className="text-xs text-secondary font-normal">
                    Status
                  </span>
                </th>
                <th className="h-8 flex items-center px-3 min-w-[125px] w-[20%]">
                  <span className="text-xs text-secondary font-normal">
                    Edited At
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length > 0 
                ? filteredTasks.map((task, index) => {
                  let url: string | null = null;

                  if (task.formId) {
                    url = task.app === App.BONUS
                      ? `/performance/bonus/${task.formId}`
                      : `/performance/merit/${task.formId}`
                  }

                  return (
                    <tr 
                      role="button"
                      key={index} 
                      onClick={() => url && router.push(url)}
                      className="flex h-full items-stretch shadow-[inset_0_-1px_0_rgb(233,233,231)] dark:shadow-[inset_0_-1px_0_rgb(47,47,47)] hover:bg-primary/6 cursor-pointer"
                    >
                      <td className="w-[35%] min-w-[250px] px-3 flex items-center shadow-[inset_-1px_0_0_rgb(233,233,231)] dark:shadow-[inset_-1px_0_0_rgb(47,47,47)]">
                        <div className="flex items-center text-sm w-full justify-between">
                          <div className="flex items-center gap-2.5 my-1">
                            <UserAvatar 
                              name={task.owner.fullName}
                              className={{
                                container: "size-7",
                                fallback: "text-sm"
                              }}
                            />
                            <div className="max-w-50">
                              <div className="h-4 self-stretch text-sm font-medium leading-4.5 whitespace-nowrap overflow-hidden text-ellipsis text-primary">
                                {task.owner.fullName}
                              </div>
                              <div className="h-4 text-xs font-medium leading-3.5 whitespace-nowrap overflow-hidden text-ellipsis text-secondary">
                                {task.owner.department}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="min-w-[85px] w-[15%] px-3 flex items-center">
                        <SelectionBadge label={types[task.app]} />
                      </td>
                      <td className="min-w-[125px] w-[20%] px-3 flex items-center">
                        <StatusBadge {...STATUS_RECORD[task.status]} />
                      </td>
                      <td className="min-w-[125px] w-[20%] px-3 flex items-center">
                        <div className="whitespace-nowrap overflow-hidden text-ellipsis text-primary text-sm">
                          {task.updatedAt ? format(task.updatedAt, "dd/MM/yy") : "-"}
                        </div>
                      </td>
                    </tr>
                  );
                }) 
                : (
                  <tr className="flex h-full items-stretch shadow-[inset_0_-1px_0_rgb(233,233,231)] dark:shadow-[inset_0_-1px_0_rgb(47,47,47)]">
                    <td colSpan={4} className="flex items-center w-full">
                      <div className="text-sm leading-4 text-secondary whitespace-nowrap overflow-hidden text-ellipsis items-center flex h-8 px-1 w-full">
                        No tasks found.
                      </div>
                    </td>
                  </tr>
                )
              }
            </tbody>
          </table>
        </TabsContent>
      </Tabs>
    </>
  );
}