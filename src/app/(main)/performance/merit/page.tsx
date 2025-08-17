import { GoProject } from "react-icons/go";

import { MeritView } from "@/modules/merit/ui/views/merit-view";

import { Hero } from "../../_components/hero";

const Page = () => {
  return (
    <main className="flex flex-col grow-0 shrink bg-background z-1 h-[calc(-44px+100vh)] max-h-full relative">
      <div className="z-[1] flex flex-col grow relative overflow-auto me-0 mb-0">
        <div className="w-full flex flex-col items-center shrink-0 grow-0 sticky top-0 left-0">
          <div className="max-w-full ps-24 w-full">
            <div className="h-6 w-full flex" />
            <Hero 
              title="KPI Merit" 
              description="Evaluate employee achievements and align merit increases with performance outcomes."
              icon={GoProject} 
            />
          </div>
        </div>
          
        <MeritView />
      </div>
    </main>
  );
}

export default Page;