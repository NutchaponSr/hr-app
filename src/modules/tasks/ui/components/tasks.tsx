"use client";

import { GoInbox } from "react-icons/go";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { TaskList } from "./task-list";
import { TaskItem } from "./task-item";

export const Tasks = () => {
  const trpc = useTRPC();

  const { data: tasks } = useSuspenseQuery(trpc.task.getMany.queryOptions());

  return (
    <article className="relative col-span-1 md:col-span-2">
      <div className="min-h-12 relative">
        <div className="flex items-center h-12 w-full ps-2">
          <div className="flex items-center h-full grow-[10] overflow-hidden -ms-1">
            <div className="flex items-center h-8 px-2.5 py-1.5 max-w-[220px] text-tertiary text-xs whitespace-nowrap space-x-1.5">
              <GoInbox className="size-3 shrink-0 stroke-[0.5]" />
              <span className="whitespace-nowrap text-ellipsis overflow-hidden font-medium">
                My tasks
              </span>
            </div>
          </div>
        </div>
      </div>

      <TaskList hasSomeTask={tasks.data.length > 0}>
        {tasks.data.map((task, index) => (
          <TaskItem key={index} task={task} />
        ))}
      </TaskList>
    </article>
  );
}