interface Props {
  children: React.ReactNode;
}

export const Footer = ({ children }: Props) => {
  return (
    <section className="sticky -bottom-px start-0 z-100">
      <div className="flex flex-col">
        <div className="pt-2.5 pb-10 bg-background">
          {children}
        </div>
      </div>
    </section>
  );
}