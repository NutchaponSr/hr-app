import { Breadcrumbs } from "@/app/(main)/_components/breadcrumbs";
import { SavingIndicator } from "@/components/saving-indicator";

export const Header = () => {
  return (
    <header className="max-w-screen z-100 bg-background">
      <div className="w-[calc(100%-0px)] max-w-screen h-11 relative">
        <div className="flex justify-between items-center overflow-hidden h-11 px-3">
          <Breadcrumbs />
          <SavingIndicator />
        </div> 
      </div>
    </header>
  );
}