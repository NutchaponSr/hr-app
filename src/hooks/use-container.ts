import { useCallback, useEffect, useRef, useState } from "react";

interface UseContainerWidthOptions {
  debounceMs?: number;
  observeResize?: boolean;
}

export const useContainerWidth = (options: UseContainerWidthOptions = {}) => {
  const { debounceMs = 100, observeResize = true } = options;
  const [width, setWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateWidth = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setWidth(rect.width);
    }
  }, []);

  const debouncedUpdateWidth = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(updateWidth, debounceMs);
  }, [updateWidth, debounceMs]);

  useEffect(() => {
    updateWidth();

    if (!observeResize) return; 

    const handleResize = () => debouncedUpdateWidth();
    window.addEventListener('resize', handleResize);

    // Use ResizeObserver for more precise element resize detection
    let resizeObserver: ResizeObserver | null = null;
    
    if (containerRef.current && 'ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(() => {
        debouncedUpdateWidth();
      });
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [debouncedUpdateWidth, updateWidth, observeResize]);

  return { width, containerRef, updateWidth };
};
