import Link from "next/link";
import Image from "next/image";

import { UserButton } from "@/modules/auth/ui/components/user-button";
import { Navbar } from "./navbar";

export const Header = () => {
  return (
    <header className="sticky top-0 transition-all z-100">
      <nav className="relative top-0 left-0 right-0 z-100 min-h-16">
        <div className="px-6 py-4 mx-auto w-full h-auto flex items-center justify-between bg-background">
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo.svg"
              alt="Logo"
              width={48}
              height={36}
            />
          </Link>
          <Navbar />
          <div className="flex gap-4 items-center justify-self-end">
            <UserButton />
          </div>
        </div>  
      </nav>
    </header>
  );
}