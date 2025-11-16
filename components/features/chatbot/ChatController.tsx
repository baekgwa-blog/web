'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useChat } from './chat-provider';

const CHATBOT_WHITELIST = ['/', '/blog', '/stack'];

export const ChatController = () => {
  const { setButtonVisible } = useChat();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/') {
      setButtonVisible(true);
      return;
    }

    const isVisibleForSubpaths = CHATBOT_WHITELIST.filter((path) => path !== '/').some((path) =>
      pathname.startsWith(path)
    );

    setButtonVisible(isVisibleForSubpaths);
  }, [pathname, setButtonVisible]);

  return null;
};
