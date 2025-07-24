import Image from "next/image";

export const Header = () => {
  return (
    <header className="fixed z-99 w-full">
      <nav className="flex items-center justify-start w-full px-5 h-20 relative overflow-hidden">
        <div className="shrink-0">
          <Image 
            loading="lazy"
            src="/logo.svg"
            alt="Logo"
            width={48}
            height={48}
          />
        </div>
      </nav>
    </header>
  );
}
