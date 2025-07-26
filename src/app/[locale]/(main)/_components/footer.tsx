import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="bg-background before:mx-6 before:block before:border before:border-border">
      <div className="flex flex-row px-16 py-6 gap-4 items-center">
        <Image 
          src="/logo.svg"
          alt="Logo"
          width={36}
          height={28}
        />
        <h4 className="text-sm text-primary font-medium">
          © 2025 Somboon Advance Technology PLC.
        </h4>
      </div>
    </footer>
  );
}