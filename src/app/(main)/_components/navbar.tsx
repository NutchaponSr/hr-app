"use client";

import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const tabs = [
  { name: "Overviews", path: "/" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "Settings", path: "/settings" }
];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverStyle, setHoverStyle] = useState({});
  const [activeStyle, setActiveStyle] = useState({ left: "0px", width: "0px" });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Set active index based on current pathname
  useEffect(() => {
    const currentIndex = tabs.findIndex(tab => tab.path === pathname);
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
    }
  }, [pathname]);

  const updateActiveStyle = (index: number) => {
    const activeElement = tabRefs.current[index];
    if (activeElement) {
      const { offsetLeft, offsetWidth } = activeElement;
      setActiveStyle({
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`,
      });
    }
  };

  useEffect(() => {
    if (hoveredIndex !== null) {
      const hoveredElement = tabRefs.current[hoveredIndex];
      if (hoveredElement) {
        const { offsetLeft, offsetWidth } = hoveredElement;
        setHoverStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    }
  }, [hoveredIndex]);

  useEffect(() => {
    updateActiveStyle(activeIndex);
  }, [activeIndex]);

  useEffect(() => {
    requestAnimationFrame(() => {
      updateActiveStyle(activeIndex);
    });
  }, [activeIndex]);

  return (
    <div className="flex justify-center items-center">
      <div className="relative">
        {/* Hover Highlight */}
        <div
          className="absolute h-[30px] transition-all duration-300 ease-out bg-accent rounded flex items-center"
          style={{
            ...hoverStyle,
            opacity: hoveredIndex !== null ? 1 : 0,
          }}
        />

        {/* Active Indicator */}
        <div
          className="absolute bottom-[-6px] h-[2px] bg-primary transition-all duration-300 ease-out rounded"
          style={activeStyle}
        />

        {/* Tabs */}
        <div className="relative flex space-x-1 items-center">
          {tabs.map((tab, index) => (
            <button
              key={tab.name}
              ref={(el) => { tabRefs.current[index] = el; }}
              className={cn(
                "px-3 py-2 cursor-pointer transition-colors duration-300 h-[30px] rounded",
                index === activeIndex ? "text-primary" : "text-neutral"
              )}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => router.push(tab.path)}
            >
              <div className="text-sm font-medium leading-5 whitespace-nowrap flex items-center justify-center h-full">
                {tab.name}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}