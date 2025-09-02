import Link from "next/link";
import Image from "next/image";

import { ImBook } from "react-icons/im";
import { BsArrowRight } from "react-icons/bs";

export const ReferenceSection = () => {
  return (
    <section className="grid grid-cols-2 gap-5 mb-3">
      <Link href="/docs" className="grid col-span-1 select-none cursor-pointer w-full min-w-[300px] h-[300px] [grid-auto-columns:minmax(0px,1fr)] box-border rounded border-[1.25px] border-[#fdebec] hover:border-[#f4ab9f66] bg-[#f3887612] hover:bg-[#fdebec] dark:bg-[#de555540] dark:border-[#ffffff08] dark:hover:bg-[#522e2a] transition group no-underline duration-150 ease-in-out">
        <div className="col-start-1 flex items-start flex-col p-7 gap-3">
          <div className="text-tertiary flex items-center gap-1.5">
            <ImBook className="text-[#f64932] size-3.5" />
            <span className="font-medium text-xs">
              Docs
            </span>
          </div>
          <h1 className="text-3xl font-semibold leading-9 overflow-hidden text-ellipsis text-primary">
            Guides
          </h1>
          <p className="text-sm leading-5 overflow-hidden text-ellipsis text-primary">
            Step-by-step tutorials for success.
          </p>
          <div className="flex-1 w-full flex justify-between items-end">
            <div className="transition-opacity opacity-0 group-hover:opacity-100 flex items-center gap-1.5 text-xs text-primary font-medium">
              Explore
              <BsArrowRight className="text-tertiary size-3 shrink-0 stroke-[0.25]" />
            </div>
          </div>
        </div>
        <div className="col-start-2 h-full w-full">
          <div className="h-full w-full relative">
            <Image 
              src="/reading-docs.png"
              alt="Reading"
              fill
              className="object-cover block"
            />
          </div>
        </div>
      </Link>
    </section>
  );
}