import { 
  BsPencilSquare, 
} from "react-icons/bs";

import { Competency, CompetencyRecord } from "@/generated/prisma";

import { Button } from "@/components/ui/button";
import { CompetencyEditModal } from "./competency-edit-modal";

interface Props {
  canPerform: boolean;
  competency: CompetencyRecord & { competency: Competency | null };
}

export const CompetencyCardHeader = ({ 
  competency,
  canPerform 
}: Props) => {
  return (
    <div data-perform={canPerform} className="absolute z-1 top-4 end-4 transition-opacity p-0.5 dark:shadow-[0_2px_12px_0_rgba(29,27,22,0.06)] border-border border-[1.25px] rounded-sm gap-px opacity-0 group-hover:opacity-100 dark:bg-[#2f2f2f] data-[perform=true]:flex hidden">
      <CompetencyEditModal competency={competency}>
        <Button variant="ghost" size="iconXs">
          <BsPencilSquare className="text-secondary" />
        </Button>
      </CompetencyEditModal>
    </div>
  );
}