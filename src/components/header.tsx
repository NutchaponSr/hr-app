import { Breadcrumbs } from "@/app/(main)/_components/breadcrumbs";

export const Header = () => {
  return (
    <header className="max-w-screen z-100 select-none bg-background">
      <div className="w-[calc(100%-0px)] max-w-screen h-11 relative">
        <div className="flex justify-between items-center overflow-hidden h-11 px-3">
          <Breadcrumbs />
        </div> 
      </div>
    </header>
  );
}