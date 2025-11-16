'use client';

import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';
import { useChat } from './chat-provider';
import { motion } from 'framer-motion';

export const ChatButton = () => {
  const { isButtonVisible, setChatOpen } = useChat();

  if (!isButtonVisible) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="fixed right-6 bottom-6 z-50"
    >
      <Button
        variant="default"
        className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 hover:shadow-2xl"
        onClick={() => setChatOpen(true)}
        aria-label="챗봇 열기"
      >
        <motion.div
          initial={{ rotate: 0 }}
          whileHover={{ rotate: 15 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <Bot className="!h-7 !w-7 text-white" />
        </motion.div>
      </Button>
    </motion.div>
  );
};
