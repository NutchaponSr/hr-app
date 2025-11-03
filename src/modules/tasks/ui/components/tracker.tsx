import { BsBullseye } from "react-icons/bs";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { STATUS_RECORD } from "@/types/kpi";

import { Button } from "@/components/ui/button";

import { 
  MainHeader, 
  MainTitle 
} from "@/components/main";
import { StatusBadge } from "@/components/status-badge";

import { UserAvatar } from "@/modules/auth/ui/components/user-avatar";

interface Props {
  year: number;
}

export const Tracker = ({ year }: Props) => {
  const trpc = useTRPC();

  const { data: tasks } = useSuspenseQuery(trpc.task.getManyByYear.queryOptions({ year }));

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

      <table className="w-full">
        <thead>
          <tr className="flex relative shadow-[inset_0_-1px_0_rgb(233,233,231),inset_0_1px_0_rgb(233,233,231)] dark:shadow-[inset_0_-1px_0_rgb(47,47,47),inset_0_1px_0_rgb(47,47,47)]">
            <th className="h-8 flex items-center px-3 min-w-[250px] w-[35%] shadow-[inset_-1px_0_0_rgb(233,233,231)] dark:shadow-[inset_-1px_0_0_rgb(47,47,47)]">
              <Button variant="ghost" size="xxs">
                <span className="text-xs text-secondary">
                  Employee
                </span>
              </Button>
            </th>
            <th className="h-8 flex items-center px-3 min-w-[85px] w-[15%]">
              <span className="text-xs text-secondary font-normal">
                Bonus
              </span>
            </th>
            <th className="h-8 flex items-center px-3 min-w-[125px] w-[25%]">
              <span className="text-xs text-secondary font-normal">
                Merit
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {tasks.length > 0 
            ? tasks.map((task, index) => (
              <tr 
                role="button"
                key={index} 
                className="flex h-full items-stretch shadow-[inset_0_-1px_0_rgb(233,233,231)] dark:shadow-[inset_0_-1px_0_rgb(47,47,47)] hover:bg-primary/6 cursor-pointer"
              >
                <td className="w-[35%] min-w-[250px] px-3 flex items-center shadow-[inset_-1px_0_0_rgb(233,233,231)] dark:shadow-[inset_-1px_0_0_rgb(47,47,47)]">
                  <div className="flex items-center text-sm w-full justify-between">
                    <div className="flex items-center gap-2.5 my-1">
                      <UserAvatar 
                        name={task.employee.fullName}
                        className={{
                          container: "size-7",
                          fallback: "text-sm"
                        }}
                      />
                      <div className="max-w-50">
                        <div className="h-4 self-stretch text-sm font-medium leading-4.5 whitespace-nowrap overflow-hidden text-ellipsis text-primary">
                          {task.employee.fullName}
                        </div>
                        <div className="h-4 text-xs font-medium leading-3.5 whitespace-nowrap overflow-hidden text-ellipsis text-secondary">
                          {task.employee.department}
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="min-w-[85px] w-[15%] px-3 flex items-center">
                  <StatusBadge {...STATUS_RECORD[task.apps.bonus as keyof typeof STATUS_RECORD]} />
                </td>
                <td className="min-w-[125px] w-[25%] px-3 flex items-center">
                  <StatusBadge {...STATUS_RECORD[task.apps.merit as keyof typeof STATUS_RECORD]} />
                </td>
              </tr>
            )) 
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
    </>
  );
}