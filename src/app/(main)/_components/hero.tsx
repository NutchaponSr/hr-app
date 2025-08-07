import Image from "next/image";

export const Hero = () => {
  return (
    <section className="w-full relative text-center flex flex-col items-center justify-center mb-0 md:text-left md:mb-5 md:flex-row">
      <div className="flex flex-col order-2 space-y-2">
        <h1 className="font-bold text-2xl md:text-3xl text-primary">Performance</h1>
        <p className="md:w-2/3 text-sm text-tertiary mb-7.5 md:mb-0">
          Track and manage employee performance reviews and goals
        </p>
      </div>
      <div className="md:ml-auto md:order-2 order-1">
        <Image 
          src="/keyboard-double-arrow-up.svg"
          alt="Performance"
          width={85}
          height={70}
          className="mb-2 md:mb-0"
        />
      </div>
    </section>
  );
}