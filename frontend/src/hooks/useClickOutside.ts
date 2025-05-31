import { useEffect, RefObject } from 'react';

export const useClickOutside = (
  refs: RefObject<HTMLElement | null>[],
  callback: () => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedOutsideAll = refs.every(ref => {
        return ref.current && !ref.current.contains(event.target as Node);
      });

      if (clickedOutsideAll) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [refs, callback]);
};