import { useCallback, useEffect, useRef, useState } from 'react';

interface UseElementHeightOptions {
  debounceMs?: number;
  includeMargin?: boolean;
}

export const useElementHeight = (options: UseElementHeightOptions = {}) => {
  const { debounceMs = 0, includeMargin = false } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const measureHeight = useCallback(() => {
    if (ref.current) {
      let elementHeight = ref.current.offsetHeight;
      
      if (includeMargin) {
        const styles = window.getComputedStyle(ref.current);
        const marginTop = parseFloat(styles.marginTop) || 0;
        const marginBottom = parseFloat(styles.marginBottom) || 0;
        elementHeight += marginTop + marginBottom;
      }
      
      setHeight(elementHeight);
    }
  }, [includeMargin]);

  const debouncedMeasure = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (debounceMs > 0) {
      timeoutRef.current = setTimeout(measureHeight, debounceMs);
    } else {
      measureHeight();
    }
  }, [measureHeight, debounceMs]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Initial measurement
    measureHeight();

    // Set up ResizeObserver for responsive height changes
    const resizeObserver = new ResizeObserver(debouncedMeasure);
    resizeObserver.observe(element);

    // Set up MutationObserver for content changes
    const mutationObserver = new MutationObserver(debouncedMeasure);
    mutationObserver.observe(element, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [measureHeight, debouncedMeasure]);

  return { ref, height };
};