import cultures from "@/modules/merit/json/culture.json";

import { BsBuildingsFill } from "react-icons/bs";

import { Banner } from "@/components/banner";
import { useTable } from "@/hooks/use-table";
import { columns } from "../components/culture-column";
import { LayoutProvider } from "@/layouts/layout-provider";
import { CultureRecordWithItem, OrganizationCulture } from "@/types/kpi";
import { useMemo } from "react";

interface Props {
  width: number;
  data: CultureRecordWithItem | null;
}

export const MeritCultureView = ({ width, data }: Props) => {
  // Combine database culture items with static culture definitions
  const combinedData: OrganizationCulture[] = useMemo(() => {
    return cultures.map((culture) => {
      const dbItem = data?.cultureItems.find(item => item.code === culture.cultureCode);
      return {
        ...culture,
        // CultureItem properties
        id: dbItem?.id || '',
        code: dbItem?.code || culture.cultureCode,
        levelBehavior: dbItem?.levelBehavior || 0,
        evidence: dbItem?.evidence || "",
        cultureRecordId: dbItem?.cultureRecordId || '',
        createdAt: dbItem?.createdAt || new Date(),
        updatedAt: dbItem?.updatedAt || new Date(),
      };
    });
  }, [data?.cultureItems]);

  const t = useTable({
    data: combinedData,
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