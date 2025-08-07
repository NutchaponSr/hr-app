import { CheckIcon } from "lucide-react"

import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline"

const items = [
  {
    id: 1,
    date: "Mar 15, 2024",
    title: "Project Kickoff",
    description:
      "Initial team meeting and project scope definition. Established key milestones and resource allocation.",
  },
  {
    id: 2,
    date: "Mar 22, 2024",
    title: "Design Phase",
    description:
      "Completed wireframes and user interface mockups. Stakeholder review and feedback incorporated.",
  },
  {
    id: 3,
    date: "Apr 5, 2024",
    title: "Development Sprint",
    description:
      "Backend API implementation and frontend component development in progress.",
  },
  {
    id: 4,
    date: "Apr 19, 2024",
    title: "Testing & Deployment",
    description:
      "Quality assurance testing, performance optimization, and production deployment preparation.",
  },
]

export default function Component() {
  return (
    <Timeline defaultValue={0}>
      {items.map((item) => (
        <TimelineItem
          key={item.id}
          step={item.id}
          className="group-data-[orientation=vertical]/timeline:ms-10"
        >
          <TimelineHeader>
            <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1rem)] group-data-[orientation=vertical]/timeline:translate-y-4" />
            <TimelineTitle>{item.title}</TimelineTitle>
            <TimelineIndicator className="group-data-completed/timeline-item:bg-green-secondary group-data-completed/timeline-item:text-primary-foreground flex size-4 items-center justify-center group-data-completed/timeline-item:border-none group-data-[orientation=vertical]/timeline:-left-7">
              <CheckIcon
                className="group-not-data-completed/timeline-item:hidden text-white"
                size={10}
              />
            </TimelineIndicator>
          </TimelineHeader>
          <TimelineContent className="text-xs">{item.description}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
