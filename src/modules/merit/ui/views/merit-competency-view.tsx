import { BsFolderFill } from "react-icons/bs";

import { Banner } from "@/components/banner";
import { useTable } from "@/hooks/use-table";
import { CompetencyItemWithInfo, CompetencyRecordWithItem } from "@/types/kpi";
import { columns } from "../components/competency-column";
import { LayoutProvider } from "@/layouts/layout-provider";

interface Props {
  width: number;
  data: CompetencyRecordWithItem | null;
}

export const MeritCompetencyView = ({ width, data }: Props) => {
  const competencyItems: CompetencyItemWithInfo[] = data?.competencyItem || [];
  
  const { table } = useTable({
    data: competencyItems,
    columns
  });

  return (
    <div
      className="w-full self-center mt-px"
      style={{ maxWidth: `${width}px` }}
    >
      <div className="contents">
        <Banner.Sub
          icon={BsFolderFill}
          title="Competency"
        />
        <div className="grow shrink-0 flex flex-col relative w-[calc(100%+192px)] -start-24">
          <div className="relative">
            <div className="grow shrink-0 h-full overflow-y-hidden overflow-x-auto">
              <div className="relative float-start min-w-full select-none pb-4 px-24 mt-1">
                <LayoutProvider
                  perform
                  variant="table"
                  table={table}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}