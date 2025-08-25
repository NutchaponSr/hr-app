import { BsBuildingsFill } from "react-icons/bs";

import { Banner } from "@/components/banner";
import { useTable } from "@/hooks/use-table";
import { columns } from "../components/culture-column";
import { LayoutProvider } from "@/layouts/layout-provider";
import { CultureRecordWithItem } from "@/types/kpi";

interface Props {
  width: number;
  data: CultureRecordWithItem | null;
}

export const MeritCultureView = ({ width, data }: Props) => {
  const t = useTable({
    data: data?.cultureItems || [],
    columns,
  });

  return (
    <div
      className="w-full self-center mt-px"
      style={{ maxWidth: `${width}px` }}
    >
      <div className="contents">
        <Banner.Sub
          icon={BsBuildingsFill}
          title="Culture"
        />
        <div className="grow shrink-0 flex flex-col relative w-[calc(100%+192px)] -start-24">
          <div className="relative">
            <div className="grow shrink-0 h-full overflow-y-hidden overflow-x-auto">
              <div className="relative float-start min-w-full select-none pb-4 px-24">
                <LayoutProvider
                  table={t.table}
                  variant="table"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}