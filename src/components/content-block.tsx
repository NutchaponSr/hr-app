interface Props {
  title: string;
  content: string | null;
}

export const ContentBlock = ({
  title,
  content,
}: Props) => {  
  return (
    <div className="space-y-1">
      <h3 className="max-w-full w-full whitespace-break-spaces break-words p-0.5 font-semibold text-[1.5em] leading-[1.3] text-primary">
        {title}
      </h3>
      <div className="w-full max-w-full whitespace-break-spaces break-words p-0.5 font-normal text-secondary">
        {content || "Empty"}
      </div>
      <div className="h-5 w-full flex py-0.5" />
    </div>
  );
}