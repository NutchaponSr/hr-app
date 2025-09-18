"use client";

import { GoInbox } from "react-icons/go";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { MainHeader, MainTitle } from "@/components/main";

import { TaskList } from "./task-list";
import { TaskItem } from "./task-item";

export const Tasks = () => {
  const trpc = useTRPC();

  const { data: tasks } = useSuspenseQuery(trpc.task.getMany.queryOptions());

  return (
    <>
      <MainHeader>
        <MainTitle>
          <GoInbox className="size-3 shrink-0 stroke-[0.5]" />
          <span className="whitespace-nowrap text-ellipsis overflow-hidden font-medium">
            My tasks
          </span>
        </MainTitle>
      </MainHeader>

      <TaskList hasSomeTask={tasks.length > 0}>
        {tasks.map((task, index) => (
          <TaskItem key={index} task={task} />
        ))}
      </TaskList>
    </>
  );
}