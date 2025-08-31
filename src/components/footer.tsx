interface Props {
  children: React.ReactNode;
}

export const Footer = ({ children }: Props) => {
  return (
    <section className="sticky -bottom-px start-0">
      <div className="flex flex-col">
        {/* <div className="bg-transparent h-[140px] w-full" /> */}
        <div className="pt-2.5 ps-24 pb-10 bg-background">
          {children}
        </div>
      </div>
    </section>
  );
}