import { BsArrowUpSquareFill } from "react-icons/bs";

import { getQueryClient, trpc } from "@/trpc/server";

import { Banner } from "@/components/banner";
import { Header } from "@/components/header";

import { Tasks } from "@/modules/performance/ui/components/tasks";
import { BonusScreen } from "@/modules/bonus/ui/components/bonus-screen";
import { MeritScreen } from "@/modules/performance/ui/components/merit-screen";

const Page = async () => {
  const queryClient = getQueryClient();

  return (
    <>
      <Header />
      <main className="grid [grid-template-columns:minmax(96px,1fr)_minmax(auto,1248px)_minmax(96px,1fr)] w-full overflow-auto relative">
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
            <BonusScreen />
            <MeritScreen />
            <Tasks />
          </section>
        </div>
      </main>
    </>
  );
}

export default Page;