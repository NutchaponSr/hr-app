interface Props {
  children: React.ReactNode;
}

export const Card = ({ children }: Props) => {
  return (
    <div className="w-full relative p-4 shadow-[0_12px_32px_rgba(0,0,0,0.02),inset_0_0_0_1px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.03),inset_0_0_0_1px_rgba(0,0,0,0.086)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] dark:hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] bg-background dark:bg-sidebar rounded-sm group">
      {children}
    </div>
  );
}