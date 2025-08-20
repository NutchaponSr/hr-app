import { badgeVariant } from "@/components/selection-badge";
import { CompetencyType } from "@/generated/prisma";
import { VariantProps } from "class-variance-authority";

export const competencyCatalog: Record<CompetencyType, VariantProps<typeof badgeVariant> & { label: string }> = {
  CC: { 
    color: "default", 
    label: "Core",
  },
  FC: { 
    color: "orange",
    label: "Functional",
  },
  MC: { 
    color: "red",
    label: "Main", 
  },
  TC: { 
    color: "default",
    label: "Technical"
  },
}