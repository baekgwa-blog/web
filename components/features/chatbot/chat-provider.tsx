'use client';

import { ChatStreamPayload, RateLimitInfo, streamChat } from '@/lib/sse-client';
import React, { createContext, useContext, useState, ReactNode, useRef } from 'react';
import { flushSync } from 'react-dom';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatContextType {
  isChatOpen: boolean;
  setChatOpen: (isOpen: boolean) => void;
  isButtonVisible: boolean;
  setButtonVisible: (isVisible: boolean) => void;
  messages: Message[];
  sendMessage: (sentence: string, filters: string[]) => void;
  isLoading: boolean;
  error: string | null;
  rateLimitInfo: RateLimitInfo | null;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [isChatOpen, setChatOpen] = useState(false);
  const [isButtonVisible, setButtonVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo | null>(null);

  const streamingMessageIdRef = useRef<string | null>(null);
  const streamingContentRef = useRef<string>('');

  const sendMessage = async (sentence: string, filters: string[]) => {
    setIsLoading(true);
    setError(null);

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: sentence,
    };

    const assistantMessageId = crypto.randomUUID();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
    };

    streamingMessageIdRef.current = assistantMessageId;
    streamingContentRef.current = '';
    setMessages((prev) => [...prev, userMessage, assistantMessage]);

    const payload: ChatStreamPayload = { sentence, filter: filters };

    try {
      await streamChat(payload, {
        onMessage: (partialResponse) => {
          streamingContentRef.current += partialResponse;

          flushSync(() => {
            setMessages((prev) => {
              const updated = prev.map((msg) => {
                if (msg.id === streamingMessageIdRef.current) {
                  const newContent = streamingContentRef.current;
                  return { ...msg, content: newContent };
                }
                return msg;
              });
              return updated;
            });
          });
        },
        onDone: () => {
          setIsLoading(false);
          streamingMessageIdRef.current = null;
          streamingContentRef.current = '';
        },
        onRateLimitInfo: (info) => setRateLimitInfo(info),
        onError: (err) => {
          if (err instanceof Error && err.message.startsWith('rate_limit_exceeded:')) {
            const parts = err.message.split(':');
            const retryAfter = Number(parts[1]);
            const minutes = retryAfter > 0 ? Math.ceil(retryAfter / 60) : 0;
            setError(
              minutes > 0
                ? `요청 한도 초과. ${minutes}분 후 다시 시도하세요.`
                : '오늘 요청 한도에 도달했습니다.'
            );
          } else {
            setError('메시지 수신 중 오류가 발생했습니다.');
          }
          setIsLoading(false);
          streamingMessageIdRef.current = null;
          streamingContentRef.current = '';
        },
      });
    } catch {
      setError('요청 전송에 실패했습니다.');
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        isChatOpen,
        setChatOpen,
        isButtonVisible,
        setButtonVisible,
        messages,
        sendMessage,
        isLoading,
        error,
        rateLimitInfo,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
