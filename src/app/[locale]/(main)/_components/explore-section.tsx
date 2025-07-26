import Image from "next/image";
import Link from "next/link";

export const ExploreSection = () => {

  return (
    <section className="md:pt-10 md:pb-20 max-w-[1200px] mx-auto">
      <h2 className="text-2xl text-balance font-bold text-primary">
        Explore
      </h2>

      <div className="grid gap-x-7 gap-y-11 mt-8 grid-cols-1 md:grid-cols-3">
        <Link href="/guides" className="rounded-sm cursor-pointer group">
          <div className="border border-border mb-5 rounded-sm w-auto h-[160px] bg-sidebar flex items-center justify-center" >
            <Image 
              src="/docsStacked.png"
              alt="Docs"
              width={60}
              height={60}
            />
          </div>
          <h3 className="text-primary group-hover:text-neutral font-medium text-base leading-7.5 pb-1">
            Guides →
          </h3>
          <p className="text-xs text-tertiary">
            Step-by-step tutorials for success.
          </p>
        </Link>
      </div>
    </section>
  );
}