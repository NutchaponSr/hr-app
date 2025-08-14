import { IconType } from "react-icons";

interface Props {
  title: string;
  description: string;
  icon: IconType;
}

export const Hero = ({ title, description, icon: Icon }: Props) => {
  return (
    <section className="w-full relative md:text-left">
      <div className="mb-2 w-full pr-24">
        <div className="flex justify-start">
          <div className="flex items-center justify-center size-9 relative shrink-0 mr-2">
            <Icon className="size-8 text-marine" />
          </div>
          <h1 className="text-primary font-bold leading-[1.2] text-3xl whitespace-break-spaces break-words">
            {title}
          </h1>
        </div>
        <div className="max-w-full overflow-hidden mb-3">
          <p className="max-w-full w-[780px] whitespace-break-spaces break-words text-primary text-sm">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}