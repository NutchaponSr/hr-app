"use client";

import { usePathname } from "next/navigation";
import { BsArrowUpSquareFill } from "react-icons/bs";

import { Banner } from "@/components/banner";
import { Header } from "@/components/header";

import { Tasks } from "@/modules/tasks/ui/components/tasks";
import { BonusScreen } from "@/modules/bonus/ui/components/bonus-screen";
import { MeritScreen } from "@/modules/merit/ui/components/merit-screen";

interface Props {
  year: number;
}

export const PerformanceView = ({ year }: Props) => {
  const pathname = usePathname();

  const paths: string[] = pathname.split("/").filter(Boolean);

  return (
    <>
    <Header paths={paths} />
      <main className="grid grid-cols-[96px_1fr_96px] w-full overflow-auto relative">
        <div className="col-start-2">
          <Banner 
            title="Performance" 
            description="Track and manage employee performance reviews and goals"
            icon={BsArrowUpSquareFill} 
          />
          <hr className="h-[1.25px] w-full border-t-[1.25px] border-border" />
        </div>
        <div className="col-start-2 my-5">
          <section className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <BonusScreen year={year} />
            <MeritScreen year={year} />
            <Tasks />
          </section>
        </div>
      </main>
    </>
  );
}