"use client";

import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Label } from "./ui/label";
import { Row } from "@tanstack/react-table";
import { Checkbox } from "./ui/checkbox";

interface Props<T> {
  row: Row<T>;
}

export const StickyCheckbox = <T,>({ row }: Props<T>) => {
  const { width } = useSidebar();
  const [isScrolled, setScrolled] = useState(false);
  const sensor = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = sensor.current?.closest(".scroll-container"); // scrollable parent

    const handleScroll = () => {
      if (sensor.current) {
        const { left } = sensor.current.getBoundingClientRect();
        const scrolled = left === width;
        setScrolled(scrolled);
      }
    };

    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll(); // initial check
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [width]);

  return (
    <div ref={sensor} className="h-full bg-background">
      <div className="h-full">
        <Label className="h-full items-start justify-center flex cursor-pointer">
          <div
            className={cn(
              "size-9 flex items-center justify-center opacity-0 group-hover/row:opacity-50 hover:opacity-100 transition-opacity",
              row.getIsSelected() && "opacity-100 group-hover/row:opacity-100"
            )}
          >
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          </div>
        </Label>
      </div>

      {/* Debug output */}
      <div>{String(isScrolled)}</div>
    </div>
  );
};
