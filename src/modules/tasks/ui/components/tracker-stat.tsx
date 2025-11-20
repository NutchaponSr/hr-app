import { NumberTicker } from "@/components/ui/number-ticker";

import { Card } from "@/components/card";

interface Props {
  value?: number;
  title: string;
  description?: React.ReactNode;
}

export const TrackerStat = ({ value, title, description }: Props) => {
  return (
    <Card className="h-auto">
      <div className="flex items-start justify-between p-3">
        <div className="flex items-start flex-col text-tertiary">
          <span className="text-xs font-medium uppercase tracking-wide">
            {title}
          </span>
          {description}
        </div>
        {value && (
        <div className="flex flex-col items-start p-3">
          <NumberTicker
            value={value}
              className="text-3xl font-semibold tracking-tighter whitespace-pre-wrap text-primary"
            />
          </div>
        )}
      </div>
    </Card>
  );
};
