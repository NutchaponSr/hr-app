import { BsQuestionCircle } from "react-icons/bs";
import { Button } from "./ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Content } from "./content";

interface Props {
  data: Array<{ label: string; content: string }>;
}

export const CardInfo = ({ data }: Props) => {
  return (
    <HoverCard openDelay={150} closeDelay={50}>
      <HoverCardTrigger asChild>
        <Button type="button" size="iconXxs" variant="ghost">
          <BsQuestionCircle className="size-3.5 text-secondary" />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent align="start" side="right" className="p-2">
        <div className="flex flex-col gap-1">
          {data.map((item, index) => (
            <Content label={item.label} key={index}>
              <p className="text-sm text-primary whitespace-break-spaces text-ellipsis overflow-hidden leading-4.5">
                {item.content}
              </p>
            </Content>
          ))}
        </div>
      </HoverCardContent> 
    </HoverCard>
  );
}