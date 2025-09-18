"use client";

import { usePathname } from "next/navigation";

import { APPS } from "@/constants";

import { 
  Main, 
  MainContent 
} from "@/components/main";
import { Banner } from "@/components/banner";
import { Header } from "@/components/header";

import { Tasks } from "@/modules/tasks/ui/components/tasks";
import { Tracker } from "@/modules/tasks/ui/components/tracker";
import { BonusInfo } from "@/modules/bonus/ui/components/bonus-info";
import { MeritInfo } from "@/modules/merit/ui/components/merit-info";

interface Props {
  year: number;
}

export const PerformanceView = ({ year }: Props) => {
  const pathname = usePathname();

  const paths: string[] = pathname.split("/").filter(Boolean);

  return (
    <>
      <Header paths={paths} />
      <Main>
        <MainContent className="col-start-2 col-end-2 min-w-0 select-none">
          <Banner
            icon={APPS.performance.icon}
            title={APPS.performance.title}
            description={APPS.performance.description}
          />
        </MainContent>

        <MainContent className="col-start-2 col-end-2 min-w-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <BonusInfo year={year} />
            <MeritInfo year={year} />
          </div>
        </MainContent>

        <MainContent className="col-start-2 col-end-2 min-w-0">
          <Tasks />
        </MainContent>

        <MainContent>
          <Tracker year={year} />
        </MainContent>
      </Main>
    </>
  );
}