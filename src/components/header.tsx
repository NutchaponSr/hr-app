import { Breadcrumbs } from "@/app/(main)/_components/breadcrumbs";

interface Props {
  children?: React.ReactNode;
}

export const Header = ({ children }: Props) => {
  return (
    <header className="max-w-screen z-100 bg-background">
      <div className="w-[calc(100%-0px)] max-w-screen h-11 relative">
        <div className="flex justify-between items-center overflow-hidden h-11 px-3">
          <Breadcrumbs />

          <div className="grow shrink" />
          <div className="grow-0 shrink-0 flex items-center ps-2.5 justify-between z-101 h-11">
            <div className="flex items-center gap-2">
              {children}
            </div>
          </div>
        </div> 
      </div>
    </header>
  );
}