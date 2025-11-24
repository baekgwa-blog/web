'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { AlertCircle, Loader2, Send, Sparkles } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { CategoryList, getCategories } from '@/lib/api/category';
import { useChat } from './chat-provider';
import { AiChatBotHealthCheckResponse, getChatbotHealthCheck } from '@/lib/api/chatbot';

const MessageBubble = ({ role, content }: { role: 'user' | 'assistant'; content: string }) => {
  const isUser = role === 'user';

  return (
    <div className={`flex w-full min-w-0 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] min-w-0 overflow-hidden rounded-lg px-4 py-3 break-words ${
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
        }`}
        style={{
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          wordWrap: 'break-word',
        }}
      >
        <div
          className="w-full break-words"
          style={{
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            wordWrap: 'break-word',
          }}
        >
          <ReactMarkdown
            components={{
              p: ({ ...props }) => (
                <p
                  {...props}
                  className="break-words whitespace-normal"
                  style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                />
              ),
              a: ({ ...props }) => (
                <a
                  {...props}
                  className="font-medium break-words text-blue-400 underline hover:text-blue-300"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                />
              ),
              h3: ({ ...props }) => (
                <h3
                  {...props}
                  className="mt-4 mb-2 text-lg font-semibold break-words"
                  style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                />
              ),
              h2: ({ ...props }) => (
                <h2
                  {...props}
                  className="mt-5 mb-2 text-xl font-semibold break-words"
                  style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                />
              ),
              ul: ({ ...props }) => (
                <ul
                  {...props}
                  className="ml-6 list-disc space-y-1 break-words"
                  style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                />
              ),
              li: ({ ...props }) => (
                <li
                  {...props}
                  className="break-words"
                  style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                />
              ),
              strong: ({ ...props }) => (
                <strong
                  {...props}
                  className="font-semibold break-words"
                  style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                />
              ),
              code: ({ ...props }) => (
                <code
                  {...props}
                  className="rounded bg-black/10 px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold break-words dark:bg-white/10"
                  style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                />
              ),
              pre: ({ ...props }) => (
                <pre
                  {...props}
                  className="my-2 overflow-x-auto rounded bg-black/10 p-2 break-words dark:bg-white/10"
                  style={{
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    whiteSpace: 'pre-wrap',
                  }}
                />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export const ChatDialog = () => {
  const { isChatOpen, setChatOpen, messages, sendMessage, isLoading, error } = useChat();
  const [input, setInput] = useState('');
  const [categories, setCategories] = useState<CategoryList[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const [healthStatus, setHealthStatus] = useState<AiChatBotHealthCheckResponse | null>(null);
  const [isHealthChecking, setIsHealthChecking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isChatOpen) {
      const initChatData = async () => {
        setIsHealthChecking(true);
        try {
          const [categoryRes, healthRes] = await Promise.all([
            getCategories(),
            getChatbotHealthCheck(),
          ]);

          if (categoryRes.isSuccess && categoryRes.data) {
            setCategories(categoryRes.data);
          }

          if (healthRes.isSuccess && healthRes.data) {
            setHealthStatus(healthRes.data);
          }
        } catch (err) {
          console.error('Failed to fetch chat init data:', err);
        } finally {
          setIsHealthChecking(false);
        }
      };

      initChatData();
    }
  }, [isChatOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Dialog가 열릴 때 이전 대화가 있으면 맨 아래로 스크롤
  useEffect(() => {
    if (isChatOpen && messages.length > 0) {
      // Dialog 애니메이션이 완료된 후 스크롤
      const timer = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isChatOpen, messages.length]);

  const isServiceUnavailable = !isHealthChecking && healthStatus?.available === false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isServiceUnavailable) return;
    sendMessage(input, selectedFilters);
    setInput('');
    setSelectedFilters([]);
  };

  const toggleFilter = (filterName: string) => {
    if (isServiceUnavailable) return;
    setSelectedFilters((prev) =>
      prev.includes(filterName) ? prev.filter((f) => f !== filterName) : [...prev, filterName]
    );
  };

  return (
    <Dialog open={isChatOpen} onOpenChange={setChatOpen}>
      <DialogContent className="flex h-[80vh] max-h-[800px] w-full max-w-[95vw] flex-col p-0 sm:max-w-3xl lg:max-w-4xl">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center text-lg">
            <Sparkles className="text-primary mr-2 h-5 w-5" />
            백과AI 챗봇
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            블로그 콘텐츠에 대해 궁금한 것을 물어보세요. AI가 요약해 드립니다.
            <br />
            현재 하루에 5회의 제한이 있습니다. 🙏
          </DialogDescription>

          {isServiceUnavailable && (
            <div className="bg-destructive/10 text-destructive mt-4 flex items-center gap-2 rounded-md p-3 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <div className="font-medium">
                현재 AI 서비스 점검 중입니다.
                <br />
                <span className="text-xs font-normal opacity-90">잠시 후 다시 시도해주세요.</span>
              </div>
            </div>
          )}
        </DialogHeader>

        {/* 메시지 영역 */}
        <ScrollArea className="min-h-0 flex-1 px-6">
          <div className="flex w-full flex-col gap-4 py-4">
            {messages.map((m) => (
              <MessageBubble key={m.id} role={m.role} content={m.content} />
            ))}
            {isLoading && messages[messages.length - 1]?.role === 'assistant' && (
              <div className="flex w-full justify-start">
                <div className="bg-muted text-muted-foreground flex items-center space-x-2 rounded-lg px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>응답을 생성 중입니다...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Footer */}
        <DialogFooter className="!flex-col border-t p-6">
          {/* 카테고리 필터 (가로 스크롤 영역) */}
          {categories.length > 0 && (
            <ScrollArea className="w-full pb-4 whitespace-nowrap">
              <div className="flex w-max items-center space-x-2">
                <span className="text-muted-foreground text-sm font-medium">필터:</span>
                {categories.map((cat) => (
                  <Badge
                    key={cat.id}
                    variant={selectedFilters.includes(cat.name) ? 'default' : 'secondary'}
                    onClick={() => toggleFilter(cat.name)}
                    className={`cursor-pointer transition-colors ${
                      isServiceUnavailable ? 'cursor-not-allowed opacity-50' : ''
                    }`}
                  >
                    {cat.name}
                  </Badge>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          )}

          {/* 에러 메시지 */}
          {error && <p className="text-destructive mb-2 text-sm">{error}</p>}

          {/* 입력창 */}
          <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isServiceUnavailable
                  ? '현재 서비스를 사용할 수 없습니다.'
                  : '궁금한 것을 물어보세요 (예: 멀티 프로세스란?)'
              }
              disabled={isLoading || isHealthChecking || isServiceUnavailable}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim() || isHealthChecking || isServiceUnavailable}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
