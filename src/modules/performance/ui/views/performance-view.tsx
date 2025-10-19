"use client";

import Link from "next/link";

import { BsWindowFullscreen } from "react-icons/bs";

import { APPS } from "@/constants";

import { useYear } from "@/hooks/use-year";
import { usePaths } from "@/hooks/use-paths";

import {
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

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
  canPerform: boolean;
}

export const PerformanceView = ({ canPerform }: Props) => {
  const paths = usePaths();
  const { year, setYear } = useYear();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <>
      <Header paths={paths} />
      <Tabs 
        asChild
        defaultValue={String(year)}
        onValueChange={(value) => setYear(Number(value))}
      >
        <Main>
          <MainContent className="col-start-2 col-end-2 min-w-0 select-none">
            <Banner
              icon={APPS.performance.icon}
              title={APPS.performance.title}
              description={APPS.performance.description}
            />
            <div className="border-b-[1.25px] border-border flex justify-between">
              <TabsList>
                {years.map((y) => (
                  <TabsTrigger key={y} value={String(y)}>
                    {y}
                  </TabsTrigger>
                ))}
              </TabsList>

              {canPerform && (
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                >
                  <Link href="/performance/admin">
                    <BsWindowFullscreen />
                    Dashboard
                  </Link>
                </Button>
              )}
            </div>
          </MainContent>
          <MainContent className="col-start-2 col-end-2 min-w-0 select-none">
            <TabsContent value={String(year)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <BonusInfo year={year} />
                <MeritInfo year={year} />
              </div>
            </TabsContent>
          </MainContent>
          <MainContent className="col-start-2 col-end-2 min-w-0 select-none">
            <Tasks />
          </MainContent>
          <MainContent className="col-start-2 col-end-2 min-w-0 select-none">
            <TabsContent value={String(year)}>
              <Tracker year={year} />
            </TabsContent>
          </MainContent>
        </Main>
      </Tabs>
    </>
  );
}