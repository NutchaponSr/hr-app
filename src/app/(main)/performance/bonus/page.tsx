import { GoProject } from "react-icons/go";

import { Tabs } from "@/components/ui/tabs";

import { Hero } from "../../_components/hero";
import { Toolbar } from "../../_components/toolbar";

const Page = () => {
  const currentYear = String(new Date().getFullYear());

  return (
    <>
      <Hero 
        title="KPI Bonus" 
        description="Track and manage employee performance reviews and goals"
        icon={GoProject} 
      />
      <Tabs defaultValue={currentYear}>
        <Toolbar />
      </Tabs>
    </>
  );
}

export default Page;