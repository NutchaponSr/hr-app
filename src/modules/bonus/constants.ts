import { Project, Strategy } from "@/generated/prisma";

export const strategies: Record<Strategy, string> = {
  [Strategy.POEPLE_CAPABILITY]: "People Capability",
  [Strategy.POEPLE_CONTINUITY]: "People Continuity",
  [Strategy.POEPLE_EFFICIENCY]: "People Efficiency",
  [Strategy.OTHER]: "Other",
};

export const projectTypes: Record<Project, string> = {
  [Project.IMPROVEMENT]: "Improvement",
  [Project.PROJECT]: "Project",
}

export interface SelectOption {
  key: string;
  label: string;
  onSelect?: (value: string) => void;
}

export const FIELD_PROCESSORS = {
  name: (value: string): string | null => {
    const trimmed = value.trim();
    return trimmed || null;
  },
  
  weight: (value: string): number | null => {
    if (!value || value.trim() === "") return null;
    
    const numValue = Number(value);
    if (isNaN(numValue)) {
      throw new Error("Weight must be a valid number");
    }
    
    if (numValue < 0) {
      throw new Error("Weight cannot be negative");
    }
    
    return numValue;
  },
  
  strategy: (value: string, options?: SelectOption[]): Strategy | null => {
    if (!value || value === "") return null;
    
    if (options) {
      const option = options.find(opt => opt.key === value || opt.label === value);
      if (!option) {
        throw new Error("Invalid strategy selection");
      }
      return option.key as Strategy;
    }
    
    if (!Object.values(Strategy).includes(value as Strategy)) {
      throw new Error("Invalid strategy value");
    }
    
    return value as Strategy;
  },
  
  type: (value: string, options?: SelectOption[]): Project | null => {
    if (!value || value === "") return null;
    
    if (options) {
      const option = options.find(opt => opt.key === value || opt.label === value);
      if (!option) {
        throw new Error("Invalid type selection");
      }
      return option.key as Project;
    }
    
    if (!Object.values(Project).includes(value as Project)) {
      throw new Error("Invalid project type value");
    }
    
    return value as Project;
  },
  
  target100: (value: string): string | null => value.trim() || null,
  target90: (value: string): string | null => value.trim() || null,
  target80: (value: string): string | null => value.trim() || null,
  target70: (value: string): string | null => value.trim() || null,
  definition: (value: string): string | null => value.trim() || null,
} as const;