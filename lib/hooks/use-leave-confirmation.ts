'use client';

import { useEffect, useRef } from 'react';

const DEFAULT_MESSAGE = '저장되지 않은 내용이 있습니다. 페이지를 떠나시겠습니까?';

export function useLeaveConfirmation(message = DEFAULT_MESSAGE) {
  const enabledRef = useRef(true);

  const disable = () => {
    enabledRef.current = false;
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!enabledRef.current) return;
      e.preventDefault();
      e.returnValue = '';
    };

    const handleClick = (e: MouseEvent) => {
      if (!enabledRef.current) return;
      const anchor = (e.target as HTMLElement).closest('a[href]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#')) return;

      if (!window.confirm(message)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handlePopState = () => {
      if (!enabledRef.current) return;
      if (!window.confirm(message)) {
        history.go(1);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleClick, true);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleClick, true);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [message]);

  return { disable };
}
