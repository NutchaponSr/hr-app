"use client";

import { CheckIcon } from "lucide-react";
import { 
  Timeline, 
  TimelineHeader, 
  TimelineItem, 
  TimelineIndicator, 
  TimelineSeparator, 
  TimelineTitle, 
  TimelineDate 
} from "@/components/ui/timeline";

interface TimelineStep {
  step: number;
  date: string;
  title: string;
  completed?: boolean;
  onClick?: () => void;
}

interface TimelineCardProps {
  title: string;
  icon: React.ReactNode;
  steps: TimelineStep[];
  defaultValue?: number;
}

export const TimelineCard = ({ 
  title, 
  icon, 
  steps, 
  defaultValue = 0 
}: TimelineCardProps) => {
  return (
    <article className="relative p-4 bg-background shadow-[0_12px_32px_rgba(0,0,0,0.02),0_0_0_1.25px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.02),0_0_0_1.25px_rgba(0,0,0,0.086)] rounded flex flex-col gap-6">
      <div className="relative w-full flex items-center space-x-3">
        <div className="flex items-center justify-center shrink-0 size-8 bg-marine rounded">
          {icon}
        </div>
        <h1 className="w-auto max-h-full whitespace-pre-wrap break-words text-primary grow text-xl font-semibold">
          {title}
        </h1>
      </div>

      <Timeline defaultValue={defaultValue}>
        {steps.map((step) => (
          <TimelineItem
            key={step.step}
            step={step.step}
            onClick={step.onClick}
            className="group-data-[orientation=vertical]/timeline:ms-10 group cursor-pointer"
          >
            <TimelineHeader>
              <TimelineDate>{step.date}</TimelineDate>
              <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1rem)] group-data-[orientation=vertical]/timeline:translate-y-0" />
              <TimelineTitle className="group-hover:underline">
                {step.title}
              </TimelineTitle>
              <TimelineIndicator className="group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground flex size-4 items-center justify-center group-data-completed/timeline-item:border-none group-data-[orientation=vertical]/timeline:-left-7">
                <CheckIcon
                  className="group-not-data-completed/timeline-item:hidden"
                  size={12}
                />
              </TimelineIndicator>
            </TimelineHeader> 
          </TimelineItem>
        ))}
      </Timeline>
    </article>
  );
};
