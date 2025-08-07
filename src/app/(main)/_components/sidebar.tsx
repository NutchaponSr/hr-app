import Link from "next/link";
import Image from "next/image";

import { IoTriangle } from "react-icons/io5";

import { APP_CATEGORIES } from "@/constants";

export const Sidebar = () => {
  return (
    <aside className="order-1 col-span-12 xs:order-1 s:order-1 m:order-1 xs:col-span-12 s:col-span-12 m:col-span-12 xl:col-span-3 xl:order-1 lg:col-span-3 lg:order-1">
      <div className="hidden invisible h-full relative xl:flex xl:visible">
        <div className="grow pr-6 box-border flex flex-col items-start justify-start">
          <div className="flex flex-col items-start justify-start sticky top-[90px] overflow-y-auto h-[calc(100vh-60px)] w-full pr-6">
            <section className="flex flex-col grow w-full after:border-r-[1.25px] after:border-border after:top-0 after:bottom-0 after:right-0 after:absolute after:ml-12">
              <div className="h-4 w-full self-start" />
              <div className="self-start w-full">
                <div className="mb-4 text-[#0009]">
                  <Link href="/" className="flex flex-row items-center mb-2 gap-2.5 px-3 py-1.5 group transition-opacity">
                    <Image 
                      src="/view-cozy.svg"
                      alt="App"
                      width={36}
                      height={36}
                    />
                    <div className="flex flex-col">
                      <h5 className="text-xs font-semibold text-primary">
                        Applications
                      </h5>
                      <p className="text-xs group-hover:opacity-70">
                        Tool, Mangement, etc.
                      </p>
                    </div>
                  </Link>

                  {APP_CATEGORIES.flatMap((cat) => 
                    cat.items.map((item) => (
                      <dl key={item.href} className="mb-2">
                        <dt className="flex text-left flex-row items-center">
                          <button className="flex items-center justify-center h-4 w-4 rounded mr-1 transition hover:bg-accent">
                            <IoTriangle className="size-2 text-[#0003] rotate-90" />
                          </button>
                          <Link href={item.href} className="text-xs hover:opacity-70 transition-opacity">
                            {item.title}
                          </Link>
                        </dt>
                      </dl>
                    ))
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </aside>
  );
}