"use client"

import { useState, useCallback, useEffect } from 'react';

// const getMatches = (width: number): boolean => {
//   // Prevents SSR issues
//   if (typeof window !== "undefined") {
//     return window.matchMedia(`(max-width: ${width}px)`).matches;
//   }
//   return false;
// };

const useMediaQuery = (width: number) => {
  const [targetReached, setTargetReached] = useState<null | boolean>(false);

  const updateTarget = useCallback(
    (e: MediaQueryListEvent) => setTargetReached(!!e.matches),
    []
  );

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${width}px)`);

    try {
      // Chrome & Firefox
      media.addEventListener('change', updateTarget);
    } catch {
      // @deprecated method - Safari <= iOS12
      media.addListener(updateTarget);
    }

    // Check on mount (callback is not called until a change occurs)
    setTargetReached(!!media.matches);

    return () => {
      try {
        // Chrome & Firefox
        media.removeEventListener('change', updateTarget);
      } catch {
        // @deprecated method - Safari <= iOS12
        media.removeListener(updateTarget);
      }
    };
  }, [updateTarget, width]);

  return targetReached;
};

const useIsMobile = () => {
  return useMediaQuery(460);
};

const useIsTablet = () => {
  return useMediaQuery(991);
};

export { useMediaQuery, useIsMobile, useIsTablet };
