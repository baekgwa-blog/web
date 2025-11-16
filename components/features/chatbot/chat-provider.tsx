'use client';

import { ChatStreamPayload, streamChat } from '@/lib/sse-client';
import React, { createContext, useContext, useState, ReactNode, useRef } from 'react';

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
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [isChatOpen, setChatOpen] = useState(false);
  const [isButtonVisible, setButtonVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 스트리밍 중인 메시지의 ID를 추적
  const streamingMessageIdRef = useRef<string | null>(null);

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

    // 사용자 메시지와 빈 어시스턴트 메시지 추가
    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    streamingMessageIdRef.current = assistantMessageId;

    const payload: ChatStreamPayload = { sentence, filter: filters };

    try {
      await streamChat(payload, {
        onMessage: (partialResponse) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === streamingMessageIdRef.current
                ? { ...msg, content: msg.content + partialResponse }
                : msg
            )
          );
        },
        onDone: () => {
          setIsLoading(false);
          streamingMessageIdRef.current = null;
        },
        onError: (err) => {
          console.error('Stream error:', err);
          setError('메시지 수신 중 오류가 발생했습니다.');
          setIsLoading(false);
          streamingMessageIdRef.current = null;
        },
      });
    } catch (err) {
      console.error('Failed to send message:', err);
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
