"use client";

import { usePathname } from "next/navigation";

import { APPS } from "@/constants";

import { Banner } from "@/components/banner";
import { Header } from "@/components/header";

import { Tasks } from "@/modules/tasks/ui/components/tasks";

import { BonusScreen } from "@/modules/bonus/ui/components/bonus-screen";

interface Props {
  year: number;
}

export const PerformanceView = ({ year }: Props) => {
  const pathname = usePathname();

  const paths: string[] = pathname.split("/").filter(Boolean);

  return (
    <>
      <Header paths={paths} />
      <main className="grow-0 shrink flex flex-col bg-background z-1 h-full max-h-full w-full">
        <div className="w-full h-full overflow-x-hidden overflow-y-auto me-0 mb-0">
          <div className="grid grid-cols-[minmax(20px,1fr)_minmax(auto,840px)_minmax(20px,1fr)] w-full gap-14 pb-[30vh]">
            <div className="col-start-2 col-end-2 min-w-0 select-none">
              <Banner
                icon={APPS.performance.icon}
                title={APPS.performance.title}
                description={APPS.performance.description}
              />
            </div>

            <div className="col-start-2 col-end-2 min-w-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <BonusScreen year={year} />
              </div>
            </div>

            <div className="col-start-2 col-end-2 min-w-0">
              <Tasks />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}