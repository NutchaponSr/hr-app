import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Content } from "@/components/content";
import { convertAmountFromUnit } from "@/lib/utils";
import { ACHIEVEMENT_LEVELS } from "../../constants/achievement-levels";

interface AchievementSelectProps {
  value: number | undefined | null;
  onChange: (value: number) => void;
  disabled: boolean;
  weight: number;
  label?: string;
}

export const AchievementSelect = ({ 
  value, 
  onChange, 
  disabled, 
  weight, 
  label = "Achievement" 
}: AchievementSelectProps) => {
  const weightValue = convertAmountFromUnit(weight, 2);
  const achievementValue = ((Number(value) || 0) / 100) * weightValue;

  return (
    <FormItem className="grow w-full">
      <FormLabel>{label}</FormLabel>
      <Select 
        value={value !== undefined && value !== null ? String(value) : ""} 
        onValueChange={(v) => onChange(Number(v))} 
        disabled={disabled}
      >
        <FormControl>
          <SelectTrigger size="sm" className="w-full">
            <div className="whitespace-nowrap overflow-hidden text-ellipsis">
              <SelectValue placeholder="Empty" />
            </div>
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {ACHIEVEMENT_LEVELS.map((level) => (
            <SelectItem key={level.value} value={level.value}>
              {level.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
      <Content label="Achievement (%) * Weight">
        <p className="text-sm text-primary whitespace-break-spaces [word-break:break-word] text-ellipsis text-4.5 overflow-hidden">
          {achievementValue.toLocaleString("en-US", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          })}
        </p>
      </Content>
    </FormItem>
  );
};